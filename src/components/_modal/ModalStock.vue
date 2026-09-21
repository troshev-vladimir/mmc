<template lang="pug">
v-dialog(v-model='isOpen', width='600')
  form.modal-stock__form(
    @submit.prevent,
    :class='{ "modal-stock__form--top-up": canUserPayWithCard && !total }'
  )
    .loading(:class='{ active: loading }')
      img(src='/img/car.gif', alt="car")
    button.modal-stock__close(type='button', @click.prevent='closeModal')
    span.modal-stock__title.title(v-if='typeof this.total === "number"') {{ modalTitle || $t('title') }}
    span.modal-stock__model.text(v-if='typeof this.total === "number"') {{ orderTitle }}

    .describe(v-if='isOptions')
      span.description-title(v-if='typeof this.total === "number"') {{ $t('description') }}
      transition(name='wrap', v-if='typeof this.total === "number"')
        .description(v-if='isDetailsWrapped')
          .modal-stock__box(v-if='options.length', style='margin-bottom: 40px')
            ul.modal-stock__list
              li.modal-stock__item(v-for='option in options', :key='option.id')
                span.modal-stock__name {{ option.name }}
                span.modal-stock__price {{ option.priceSum }} {{ currency }}

          .modal-stock__box(v-if='errorsString && errorsString.length')
            span.modal-stock__head.text-small {{ $t('head2') }}
            .modal-stock__body
              span.modal-stock__name {{ errorsString }}
              span.modal-stock__price {{ errorsSumm }} {{ currency }}

          .modal-stock__box(v-if='discount')
            span.modal-stock__head.text-small {{ $t('head-discaunt') }}
            .modal-stock__body(
              style='display: flex; justify-content: space-between'
            )
              span {{ $t('discountText') }}
              span -{{ discount }} {{ currency }}

      slot
      .wrap(
        v-if='typeof this.total === "number"',
        :class='{ wrapped: !isDetailsWrapped }',
        @click='isDetailsWrapped = !isDetailsWrapped'
      )
        .wrap__btn {{ wrpapBtnText }}
          |
          ChevronIcon(style="width: 20px; height: 20px; fill: #888")
    .modal-stock__balance(v-if='typeof this.total === "number"')
      .current-balance(
        :class='{ "not-enough": !isBalanceAmountMoreThenPrice }'
      )
        .current-balance__title {{ $t('balance') }}
        .current-balance__amount {{ formattedUserBalance }}
      .modal-stock__balance-error(v-if='!isBalanceAmountMoreThenPrice') {{ $t('balance-error') }}

    label.email(v-if='isEmailrequired')
      span.email-label(v-html='$t("email")')
      input.input-text(
        v-model='email',
        :style='{ "border-color": emailError ? "#E52E2E" : false }',
        required,
        :placeholder='$t("emailPlaceholder")'
      )
      span.email-error(v-if='emailError') {{ emailError }}

    StockLine(
      v-if='typeof this.total === "number"'
      v-model='acception'
      class="mb-2"
    )

    span.modal-stock__total.text-big.fw_bold(v-if='total') {{ $t('total') }}: {{ totalPrice }} {{ currency }}

    button.modal-stock__btn.modal-stock__get-solution.button_accent(
      :disabled='isButtonDisabled',
      v-if='isBalanceAmountMoreThenPrice',
      @click='spendManyFromBalance'
    ) {{ $t('get-solution') }}

    button.modal-stock__btn.modal-stock__replenish-balance.button_accent(
      :disabled='isButtonDisabled',
      v-if='!isBalanceAmountMoreThenPrice && !replenishBalance && purchaseType !== "Balance"',
      @click='onRplenishBalance'
    ) {{ $t('replenish-balance') }}

    transition(name='wrap')
      .replenish-balance(
        v-if='(replenishBalance || purchaseType === "Balance") && !isBalanceAmountMoreThenPrice',
        :class='{ "mb-0": purchaseType === "Balance" }'
      )
        .replenish-balance__title {{ $t('balance-in') }}
          |
          span.title_accent MMC flash
        .replenish-balance__description(v-if='showTopUpBonus') {{ $t("replenish-description") }}
        v-text-field(
          v-model='replenishBalanceAmount',
          clearable,
          :label='$t("top-up-summ")',
          :hint='canUserTopUpWithLavaTop && !isLavaTopAmountValid ? lavaTopMinimumHint : ""',
          persistent-hint,
          type='number'
        )
        .preselected-amount
          v-chip.mr-2(
            v-for='i in [1000, 5000, 10000]',
            :key='i',
            @click='replenishBalanceAmount = i'
          ) {{ i }} ₽
        StockLine(v-if='!typeof this.total === "number"', v-model='acception')

        button.modal-stock__btn.modal-stock__accept-summ.button_accent(
          :disabled='isButtonDisabled || replenishBalanceAmount <= 0',
          @click='palanishCustomSumm'
        ) {{ $t('accept-summ') }}
        button.modal-stock__btn.button_accent.mt-2(
          type='button',
          v-if='canUserTopUpWithLavaTop',
          :disabled='isButtonDisabled || !isLavaTopAmountValid',
          @click='payWithLavaTop(true)'
        ) {{ $t('top-up-lavatop') }}
    button.modal-stock__btn.modal-stock__instant-pay.button_accent(
      :disabled='isButtonDisabled',
      v-if='!isBalanceAmountMoreThenPrice && canUserPayWithCard && total',
      @click='payWithCard'
    ) {{ $t('instant-pay') }}
    button.modal-stock__btn.button_accent.mt-2(
      type='button',
      :disabled='isButtonDisabled || !isLavaTopOrderAmountValid',
      v-if='!isBalanceAmountMoreThenPrice && canUserPayWithLavaTop && total > 0',
      @click='payWithLavaTop()'
    ) {{ $t('pay-lavatop') }}
    p.text-small.mt-2(
      v-if='!isBalanceAmountMoreThenPrice && canUserPayWithLavaTop && total > 0 && !isLavaTopOrderAmountValid'
    ) {{ lavaTopMinimumHint }}
</template>

<script lang="ts">
  import '@/assets/styles/imports/modal-stock.sass'
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import api from '@/api'
  import storage from '@/storage'
  import { PaymentProvider, PaymentScriptParams } from '@/api/payment'
  import { vxm } from '@/vuex'
  import numberFormatter from '@/additionally/formatters'
  import StockLine from './StockLine.vue'
  import checkPaymentStatus from '@/additionally/makePulling'
  import openLavaTopPayment from '@/additionally/lavaTopPayment'
  import getLavaTopMinimumAmount, { isLavaTopAmountValid } from '@/additionally/lavaTopLimits'
  import { TaskInterface } from '@/interfaces/task'
  import Dtc = TaskInterface.Dtc
  import getCurrencyName from '@/additionally/getCurrencyName'
  import ChevronIcon from '@/components/icons/chevron.vue'

  export interface Error {
    code: string;
    error: string;
    field: string;
  }

  type PurchaseType =
    | 'Subscription'
    | 'Balance'
    | 'Order'
    | 'Task'
    | 'Mmc'
    | 'Stock'
    | 'Hardware'

  @Component({
    components: {
      StockLine,
      ChevronIcon
    },
  })
  export default class ModalStock extends Vue {
    @Prop({ type: Boolean }) readonly value!: boolean
    @Prop({ type: [Number, String] }) readonly id!: number | string
    @Prop({ type: String }) readonly modalTitle!: string
    @Prop({ type: String }) readonly orderTitle!: string
    @Prop({ type: Number }) readonly total!: number
    @Prop({ type: String, default: '$' }) readonly currency!: string
    @Prop({ type: Number }) readonly discount!: number
    @Prop({ type: Array, default: () => [] }) readonly options!: []
    @Prop({ type: Array, default: () => [] }) readonly errors!: []
    @Prop({ type: Number }) readonly errorsSumm!: number
    @Prop({ type: String, required: true }) readonly purchaseType!: PurchaseType
    @Prop({ type: String }) readonly mmcFlashKey?: string
    @Prop({ type: Boolean }) readonly withoutDownload?: boolean
    @Prop({ type: String }) readonly stockSource?: string

    paymentScriptParams:
      | null
      | undefined
      | PaymentScriptParams<PaymentProvider> = null
    checkPaySatusMethod?: Function = undefined
    email = ''
    emailError = ''
    isEmailrequired = false
    loading = false
    lavaTopPending = false
    lavaTopAttempt = 0
    isDetailsWrapped = true
    replenishBalance = false
    // Установить true, чтобы снова показывать текст о бонусах за пополнение.
    showTopUpBonus = false
    replenishBalanceAmount = getLavaTopMinimumAmount(vxm.user.user?.currencyId || 1)
    acception = false

    closeModal() {
      this.isOpen = false
    }

    loadRobokassa() {
      // @ts-expect-error
      if (!window.Robocassa) {
        document.dispatchEvent(new Event('RobocassaLoad'))
      }
    }

    get isOpen() {
      return this.value
    }
    set isOpen(value) {
      if (!value) this.cancelLavaTopPayment()
      this.$emit('input', value)
    }

    get isOptions() {
      return this.options.length || this.errors.length || this.discount
    }

    get wrpapBtnText() {
      return this.isDetailsWrapped
        ? String(this.$t('wrap-btn'))
        : String(this.$t('unwrap-btn'))
    }

    get isButtonDisabled() {
      return this.loading || (this.isEmailrequired && !this.email) || !this.acception
    }

    get lang() {
      return vxm.user.lang
    }

    get paymentKind() {
      return vxm.user.user?.currencyId !== 1 ? 'Crypto' : 'Robokassa'
    }

    get isCrypto() {
      return this.paymentKind === 'Crypto'
    }

    get userBalance() {
      return vxm.user.balance
    }

    get formattedUserBalance() {
      return numberFormatter(this.userBalance, true)
    }

    get isBalanceAmountMoreThenPrice() {

      return (
        Number(this.userBalance) >= Number(this.total) &&
        !!(this.id || this.purchaseType === 'Mmc' || this.purchaseType === 'Hardware')
      ) // mmc нет id
    }

    get errorsString(): string {
      const checkedList: Array<string> = []
      for (let i = 0, len = this.errors.length; i < len; i++) {
        const patch: Dtc = this.errors[i]
        if (patch.isSel) checkedList.push(patch.dtc)
      }
      if (checkedList.length) return checkedList.join(', ')
      return ''
    }

    async beforeStartPayment(isCancelled: () => boolean = () => false) {
      if (this.isEmailrequired) {
        try {
          const responce = await api.order.changeEmail({
            email: this.email,
            lang: vxm.user.lang,
          })
        } catch (error) {
          if (isCancelled()) return false
          this.emailError = error.errors?.[0]?.error || String(this.$t('email-error'))
          return false
        }
        if (isCancelled()) return false
        this.emailError = ''
        await api.authorize.getUser()
      }
      if (isCancelled()) return false
      this.loading = true
      return true
    }

    async getPaymentScriptParams(provider: PaymentProvider) {
      switch (this.purchaseType) {
        case 'Subscription':
          this.paymentScriptParams =
            await api.subscription.getPaymentScriptParams(this.id, provider)
          this.checkPaySatusMethod = api.subscription.checkPayStatus.bind(
            api.subscription
          )

          break

        case 'Order':
          this.paymentScriptParams = await api.payment.getPaymentScriptParams(
            +this.id,
            provider
          )
          this.checkPaySatusMethod = api.payment.getTaskStatus.bind(api.payment)

          break

        case 'Task':
          this.paymentScriptParams = await api.order.getPaymentScriptParams<PaymentProvider>(
            +this.id,
            provider
          )
          this.checkPaySatusMethod = api.order.getPaymentStatus.bind(api.order)

          break

        case 'Mmc':
          this.paymentScriptParams = await api.mmcStore.getPaymentScriptParams({
            mmcFlashKey: this.mmcFlashKey,
            language: vxm.user.lang,
            moduleIds: this.options.map((el: any) => el.id),
            currency: this.currencyName,
            total: this.total,
            provider,
          })
          this.checkPaySatusMethod = api.mmcStore.checkPayStatus.bind(
            api.mmcStore
          )
          break

        case 'Hardware':
          this.paymentScriptParams = await api.mmcStore.getPaymentScriptParams({
            mmcFlashKey: this.mmcFlashKey,
            storeType: 'MmcStoreHw',
            language: vxm.user.lang,
            moduleIds: this.options.map((el: any) => el.id),
            currency: this.currencyName,
            total: this.total,
            provider,
          })
          this.checkPaySatusMethod = api.mmcStore.checkPayStatus.bind(
            api.mmcStore
          )
          break

        case 'Stock':
          this.paymentScriptParams = await api.stockFile.getPaymentScriptParams<
            typeof provider
          >(vxm.user.lang, provider, this.stockSource || '', this.id)
          this.checkPaySatusMethod = api.stockFile.getPaymentStatus.bind(
            api.stockFile
          )
          break

        default:
          break
      }
    }

    async spendManyFromBalance() {
      if (!(await this.beforeStartPayment())) return
      await api.balance.setBalance()

      if (this.total < 0) {
        this.closeModal()
        this.$toasted.success(String(this.$t('subscribtion-bought')), {
          icon: 'check',
        })
        this.$emit('success')

        if (!this.withoutDownload) {
          // @ts-expect-error
          const docId = this.paymentScriptParams?.documentId
          const id = this.purchaseType === 'Stock' ? docId : this.id
          storage.lastPaymentId = id
          storage.lastPaymentType = this.purchaseType
        }

        this.$router.push({
          name: 'History',
          params: { lang: this.$route.params.lang },
        })

        return
      }

      if (Number(this.userBalance) < Number(this.total)) {
        this.$toasted.error(String(this.$t('balance-error')), {
          icon: 'error',
        })
        return
      }

      try {
        await this.getPaymentScriptParams('Balance')
        const params = this.paymentScriptParams as PaymentScriptParams<'Balance'>

        if (params?.state === 'Insufficient') {
          this.$toasted.error(String(this.$t('balance-error')), {
            icon: 'error',
          })
          return
        }
      } catch (error) {
        this.loading = false
        this.closeModal()
        return
      }

      fetch('https://api.mmcflash.ru:8888/api/Payment/PaymentCallbackBalance', {
        method: 'POST',
        body: JSON.stringify(this.paymentScriptParams),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then(() => {
          this.loading = false
          this.closeModal()
          api.balance.setBalance()
        })
        .then(() => {
          if (this.purchaseType === 'Subscription') {
            this.$toasted.success(String(this.$t('subscribtion-bought')), {
              icon: 'check',
            })
            this.$emit('success')
            return
          }

          if (!this.withoutDownload) {
            // @ts-expect-error
            const docId = this.paymentScriptParams?.documentId
            const id = this.purchaseType === 'Stock' ? docId : this.id
            storage.lastPaymentId = id
            storage.lastPaymentType = this.purchaseType
          }

          this.$router.push({
            name: 'History',
            params: { lang: this.$route.params.lang },
          })
        })
    }

    get currencyName() {
      return getCurrencyName(vxm.user.user?.currencyId || 1)
    }

    onRplenishBalance() {
      if (vxm.user.user?.currencyId === 1) {
        this.isDetailsWrapped = false
        this.replenishBalance = true
      } else {
        this.$router.push({
          name: 'Balance',
          params: { lang: this.$route.params.lang, isModalOpen: 'open' },
        })
      }
    }

    get canUserPayWithCard() {
      return vxm.user.user?.currencyId === 1
    }

    get canUserPayWithLavaTop() {
      return [1, 2, 3].includes(vxm.user.user?.currencyId || 0)
    }

    get canUserTopUpWithLavaTop() {
      // Match the site selection in App: non-RU hosts, including localhost, use EU.
      const isEuSite = !window.location.hostname.includes('.ru')
      return this.canUserPayWithLavaTop && !(isEuSite && vxm.user.user?.currencyId === 1)
    }

    get isLavaTopAmountValid() {
      return isLavaTopAmountValid(this.replenishBalanceAmount, vxm.user.user?.currencyId || 1)
    }

    get isLavaTopOrderAmountValid() {
      return isLavaTopAmountValid(this.total, vxm.user.user?.currencyId || 1)
    }

    get lavaTopMinimumAmount() {
      return getLavaTopMinimumAmount(vxm.user.user?.currencyId || 1)
    }

    get lavaTopMinimumHint() {
      return String(this.$t('lavatop-minimum-amount', {
        amount: this.lavaTopMinimumAmount,
        currency: this.currencyName.toUpperCase(),
      }))
    }

    @Watch('lavaTopMinimumAmount')
    onLavaTopMinimumChanged(minimum: number) {
      this.cancelLavaTopPayment()
      this.replenishBalanceAmount = minimum
    }

    cancelLavaTopPayment() {
      this.lavaTopAttempt++
      if (this.lavaTopPending) this.loading = false
      this.lavaTopPending = false
    }

    async payWithLavaTop(topUp = false) {
      if (this.isButtonDisabled || !this.canUserPayWithLavaTop) return
      if (topUp && !this.canUserTopUpWithLavaTop) return
      if (topUp ? !this.isLavaTopAmountValid : !this.isLavaTopOrderAmountValid) return

      const attempt = ++this.lavaTopAttempt
      const purchaseType = this.purchaseType
      const purchaseId = this.id
      const amount = Number(this.replenishBalanceAmount)
      const isCancelled = () => attempt !== this.lavaTopAttempt || !this.isOpen
      this.lavaTopPending = true
      this.loading = true
      let paymentOpened = false

      try {
        const params = await openLavaTopPayment(async () => {
          if (!(await this.beforeStartPayment(isCancelled))) return null
          if (topUp) {
            return api.balance.getPaymentScriptParams({
              language: this.lang,
              currency: this.currencyName,
              amonth: amount,
              provider: 'LavaTop',
            })
          }
          await this.getPaymentScriptParams('LavaTop')
          if (!this.paymentScriptParams) throw new Error('invalid-payment-response')
          return this.paymentScriptParams as PaymentScriptParams<'LavaTop'>
        }, isCancelled)
        if (!params || isCancelled()) return
        paymentOpened = true

        const statusId = !topUp && ['Order', 'Task'].includes(purchaseType)
          ? purchaseId
          : params.documentId
        const checkStatus = topUp ? api.balance.checkPayStatus : this.checkPaySatusMethod
        if (!checkStatus) throw new Error('invalid-payment-response')
        const paid = await checkPaymentStatus(statusId, checkStatus, {
          trackRobokassaFocus: false,
          isCancelled,
        })
        if (isCancelled()) return
        if (!paid) {
          this.$toasted.info(String(this.$t('payment-pending')))
          return
        }

        if (topUp) {
          await api.balance.setBalance()
          if (isCancelled()) return
          this.$toasted.success(String(this.$t('balance-topped-up')))
          if (purchaseType === 'Balance') this.closeModal()
        } else if (purchaseType === 'Subscription') {
          this.closeModal()
          this.$emit('success')
          this.$toasted.success(String(this.$t('subscribtion-bought')))
        } else {
          storage.lastPaymentId = null
          storage.lastPaymentType = null
          sessionStorage.removeItem('lastPaymentId')
          // History supports automatic downloads for processed tasks and stock files.
          if (!this.withoutDownload && ['Order', 'Stock'].includes(purchaseType)) {
            storage.lastPaymentId = purchaseType === 'Stock' ? params.documentId : purchaseId
            storage.lastPaymentType = purchaseType
          }
          this.closeModal()
          this.$router.push({ name: 'History', params: { lang: this.$route.params.lang } })
        }
      } catch (error) {
        if (isCancelled()) return
        if (['popup-blocked', 'invalid-payment-response'].includes(error.message)) {
          this.$toasted.error(String(this.$t(error.message)))
        } else if (paymentOpened) {
          this.$toasted.info(String(this.$t('payment-pending')))
        }
      } finally {
        if (attempt === this.lavaTopAttempt) {
          this.lavaTopPending = false
          this.loading = false
        }
      }
    }

    async payWithCard() {
      if (!(await this.beforeStartPayment())) return
      try {
        await this.getPaymentScriptParams('Robocassa')

        // @ts-expect-error
        // eslint-disable-next-line no-undef
        Robokassa.StartPayment(this.paymentScriptParams)

        if (this.purchaseType === 'Subscription') {
          // @ts-expect-error
          await this.checkStatusSubscription(this.paymentScriptParams?.invId)
          return
        }

        if (['Mmc', 'Stock', "Hardware"].includes(this.purchaseType)) {
          // @ts-expect-error
          await this.checkStatusTask(this.paymentScriptParams?.invId)
        } else {
          await this.checkStatusTask(this.id)
        }
      } catch (error) {
        console.log(error)
        this.closeModal()
      }
    }

    // async payWithCrypto() {//Не используется в этой модалке но на всякий случай сделал
    //   await this.beforeStartPayment()
    //   this.paymentScriptParams = await api.payment.getPaymentScriptParams<'CryptoCloud'>(
    //     this.id,
    //     'CryptoCloud'
    //   )
    //   // @ts-expect-error
    //   window.open(this.paymentScriptParams?.pay_url, '_blank')
    //   await this.checkStatusBalance(+this.paymentScriptParams?.order_id)
    // }

    async palanishCustomSumm() {
      if (!(await this.beforeStartPayment())) return

      this.paymentScriptParams = (await api.balance.getPaymentScriptParams({
        language: 'ru',
        currency: 'rub',
        amonth: this.replenishBalanceAmount,
        provider: 'Robocassa',
      })) as PaymentScriptParams<'Robocassa'>

      // @ts-expect-error
      // eslint-disable-next-line no-undef
      Robokassa.StartPayment(this.paymentScriptParams)
      await this.checkStatusBalance(+this.paymentScriptParams?.invId)
    }

    async checkStatusTask(taskId: number | string) {
      const payment = await checkPaymentStatus(taskId, this.checkPaySatusMethod!)
      if (payment) {
        storage.lastPaymentId = taskId
        this.closeModal()
        this.$router.push('History')
      }
    }

    async checkStatusSubscription(taskId: number | string) {
      const payment = await checkPaymentStatus(taskId, this.checkPaySatusMethod!)
      if (payment) {
        this.closeModal()
        this.$emit('success')
        this.$toasted.success(String(this.$t('subscribtion-bought')), {
          icon: 'check',
        })
      }
    }

    async checkStatusBalance(documentId: number) {
      const payment = await checkPaymentStatus(
        documentId,
        api.balance.checkPayStatus
      )

      if (payment) {
        this.loading = false
        await api.balance.setBalance()

        if (!this.total) {
          // Если на странице баланса
          this.closeModal()
        }
      }
    }

    get totalPrice() {
      return numberFormatter(this.total)
    }

    async created() {
      try {
        if (vxm.user.userIsAuth) {
          const response = await api.order.isEmailRequired()
          this.isEmailrequired = !!response?.isEmailRequired
        }
      } catch (error) {
        console.log(error)
      }
    }

    onCloseIFrame() {
      if (!this.lavaTopPending) this.loading = false
    }

    mounted() {
      document.addEventListener('closeRobokassaIframe', this.onCloseIFrame)
    }

    beforeDestroy() {
      this.cancelLavaTopPayment()
      document.removeEventListener('closeRobokassaIframe', this.onCloseIFrame)
    }

    @Watch('isOpen')
    async onModalVisibilityChange(value: boolean) {
      if (!value) {
        this.cancelLavaTopPayment()
        this.loading = false
      } else {
        this.loadRobokassa()
        await api.balance.setBalance()
      }
    }
  }
</script>

<i18n>
{
  "ru": {
    "title": "Оформление заказа",
    "total": "Итого к оплате",
    "button": "Перейти к оплате",
    "discountText": "Скидка по промокоду: ",
    "email": "E-mail для отправки чека об оплате, файла прошивки и для связи по техническим и гарантийным вопросам:",
    "emailPlaceholder": "Введите ваш e-mail",
    "get-solution": "получить решение",
    "replenish-balance": "Пополнить баланс ЛК",
    "instant-pay": "Оплатить с помощью карты",
    "pay-lavatop": "Оплатить через LavaTop",
    "top-up-lavatop": "Пополнить через LavaTop",
    "lavatop-minimum-amount": "Минимальная сумма оплаты через LavaTop — {amount} {currency}",
    "popup-blocked": "Разрешите открытие новой вкладки для перехода к оплате.",
    "invalid-payment-response": "Не удалось получить ссылку на оплату. Попробуйте позже.",
    "payment-pending": "Оплата пока не подтверждена. Проверьте баланс или статус заказа позже.",
    "balance-topped-up": "Баланс успешно пополнен",
    "email-error": "Не удалось сохранить email. Проверьте адрес и попробуйте ещё раз.",
    "accept-summ": "пополнить",
    "wrap-btn": "Свернуть",
    "unwrap-btn": "Развернуть",
    "description": "Выбранные опции",
    "balance": "Баланс Личного кабинета",
    "balance-error": "На балансе Личного кабинета не достаточно денежных средств для оплаты",
    "head2": "Отключенные ошибки DTC",
    "head-discaunt": "Скидки",
    "replenish-description": "При пополнении баланса на сумму 10 000₽, мы зачислим вам на счет дополнительно 500₽, при сумме 50 000₽ дополнительно 3000₽, свыше 100 000₽ дополнительно 10 000₽",
    "balance-in": "Пополнение баланса",
    "top-up-summ": "Сумма пополнения",
    "subscribtion-bought": "Подписка успешно куплена"
  },
  "en": {
    "title": "My order",
    "total": "Total",
    "button": "Proceed to payment",
    "discountText": "Discount by promocode: ",
    "email": "E-mail for sending payment receipt, ECU file and for communication on technical and warranty issues:",
    "emailPlaceholder": "Enter your e-mail",
    "get-solution": "Get solution",
    "replenish-balance": "Top up your Personal Account balance",
    "instant-pay": "Pay by card",
    "pay-lavatop": "PAY WITH VISA, MASTERCARD, etc.",
    "top-up-lavatop": "Top up with LavaTop",
    "lavatop-minimum-amount": "The minimum payment amount with LavaTop is {amount} {currency}",
    "popup-blocked": "Allow a new tab to open to proceed to payment.",
    "invalid-payment-response": "Could not get the payment link. Please try again later.",
    "payment-pending": "Payment has not been confirmed yet. Check your balance or order status later.",
    "balance-topped-up": "Balance topped up successfully",
    "email-error": "Could not save your email. Check the address and try again.",
    "accept-summ": "Top up",
    "wrap-btn": "Roll up",
    "unwrap-btn": "Expand",
    "description": "Selected options",
    "balance": "Personal Account balance",
    "balance-error": "There are insufficient funds in your Personal Account balance for payment",
    "head2": "Deactivated DTC Codes",
    "head-discaunt": "Discount",
    "replenish-description": "When you top up your balance in the amount of 10,000₽, we will credit your account with an additional 500₽, for an amount of 50,000₽ with an additional 3,000₽, over 100,000₽ with an additional 10,000₽",
    "balance-in": "Top up your balance",
    "top-up-summ": "Top up amount",
    "subscribtion-bought": "Subscription successfully purchased"
  }
}
</i18n>

<style scoped lang='scss'>
  .modal-stock {
    $root: &;

    &__box {
      .box-title {
        color: var(--, rgba(51, 51, 51, 0.6));
        font-size: 14px;
        font-weight: 400;
        padding-bottom: 6px;
        border-bottom: 1px solid currentColor;
        margin-bottom: 6px;
      }
    }

    &__form {
      position: relative;

      &--top-up {
        .replenish-balance {
          background-color: transparent;

          &__title {
            text-align: left;
          }
          .preselected-amount {
            margin-bottom: 40px;
          }
        }

        #{$root}__line {
          margin-bottom: 40px;
        }
      }
    }

    &__total {
      margin-bottom: 40px;
    }

    &__balance {
      margin: 40px 0;
    }

    &__balance-error {
      color: rgba(51, 51, 51, 0.6);
      font-size: 14px;
      font-weight: 400;
    }

    &__btn {
      display: block;
      width: 100%;
    }

    &__replenish-balance {
      margin-bottom: 20px;
    }
  }

  .replenish-balance {
    margin-bottom: 40px;
    border-radius: 5px;
    background-color: #dfeaff;
    padding: 10px;

    &__title {
      font-size: 23px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 20px;
    }

    &__description {
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
      margin-bottom: 40px;
    }

    .preselected-amount {
      margin-bottom: 20px;
    }
  }
  .wrap {
    display: block;
    width: 100%;
    color: rgba(51, 51, 51, 0.6);
    border-top: 1px solid;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;

    &__btn {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      transition: all ease 0.4s;

      svg {
        margin-left: 5px;
      }
    }

    &.wrapped {
      .wrap__btn {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }

  .description-title {
    display: block;
    width: 100%;
    color: rgba(51, 51, 51, 0.6);
    border-bottom: 1px solid;
  }

  .description {
    padding: 6px 0 0;
  }
  .current-balance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 700;

    &.not-enough {
      .current-balance__title {
        color: #e31e24;
      }
      .current-balance__amount {
        color: #e31e24;
      }
    }
  }

  .email {
    display: flex;
    flex-direction: column;

    input {
      padding: 10px 17px;
    }
  }

  .email-error {
    color: red;
  }

  .email-label {
    margin-bottom: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #333333;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background-color: rgba(#fff, 0.7);
    z-index: 10;
  }

  .loading.active {
    display: flex;

    img {
      width: 80px;
      height: 80px;
    }
  }

  .wrap-enter-active,
  .wrap-leave-active {
    transition: all 0.6s;
    max-height: 230px;
    overflow: hidden;
  }
  .wrap-enter,
  .wrap-leave-to {
    max-height: 0px;
  }
</style>

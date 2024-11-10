<template lang="pug">
.patches.tuning(v-if="patches.length")
  .patches__head
    span.patches__head-name.text-small(v-text="$t('availableForProcessing')")
    span.patches__head-count.text-small {{ $t('availableParameter') }} {{ patches.length }}
  form.patches__body(@change.prevent="eventChangeList")
    label.patches__item(v-for="(patch, index) in patches", :key="index")
      input.patches__input(type="checkbox", :value="patch.id", v-model="patch.isSelected", :disabled="!patch.isActive")

      span.patches__name.text-small 
        .d-flex.flex-column.flex-md-row.align-md-center
          p.mb-2.mb-md-0.flex-grow-0 {{ patch.name }}
          .patches__note(v-if="patch.infos.length")
            .patches__note-box(v-text="getNote(patch.infos)")
          .patch_container.flex-shrink-0.flex-grow-0.mr-md-2.mb-2.mb-md-0.d-flex.flex-row.align-center.justify-space-between.justify-md-start.flex-wrap
            v-chip(
              class="ml-2"
              color="green"
              text-color="white"
              x-small
              v-if="patch.isFreePrice"
            ) {{$t('free')}}
            button.button_accent.button-description.flex-grow-0.ml-md-2(@click.prevent="showDescription(patch.slug)") {{$t('description')}}

          span.ml-md-auto.flex-shrink-0(v-if="patch.isSelected") {{patchPrice(patch.priceSum)}}{{currency}}
          
  v-dialog(v-model='isTuningDescription', width='600')
    .card-description 
      p.content(v-html="patchDescription")
  .patches__footer
    span.patches__footer-list
    span.patches__footer-price(v-show="totalPatchPrice") {{ $t('price') }}: {{ totalPatchPrice() }}{{currency}}
</template>

<script lang="ts">
import '@/assets/styles/imports/patches.sass'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskInterface } from '@/interfaces/task'
import getLangId from '@/additionally/getLangId'
import Patch = TaskInterface.Patch
import numberFormatter from '@/additionally/formatters'
import api from '@/api'
import { vxm } from '@/vuex'

@Component
export default class Patches extends Vue {
  @Prop(Array) readonly patches!: Array<Patch>
  @Prop({ type: String, default: '$' }) readonly currency!: string
  langId = 1
  timer: ReturnType<typeof setTimeout> | null = null
  isTuningDescription = false
  patchDescription = ''

  async showDescription(description: string) {
    let news
    try {
      news = await api.news.item(description, vxm.user.lang)
    } catch (error) {
      console.log(error);
    }

    this.patchDescription = news?.html || String(this.$t('not-found'))
    this.isTuningDescription = true 
  }

  eventChangeList () {
    this.timer = null
    this.timer = setTimeout(() => {
      this.$emit('change-patch')
    }, 500)
  }

  getNote (infos: Array<{ langId: number; descr: string }>): string {
    const info = infos.find(info => info.langId === this.langId)
    if (info) return info.descr
    return ''
  }

  patchColorGroup(priceGroup: string) {
    let color = 'white'
    switch (priceGroup) {
      case 'Eco':
        color = 'blue-grey lighten-4'
        break;
      case 'G2':
          color = 'blue-grey lighten-4'
          break;
      case 'G3':
          color = 'blue-grey lighten-4'
          break;
      case 'G4':
          color = 'blue-grey lighten-4'
          break;
      case 'G5':
          color = 'blue-grey lighten-4'
          break;
      default:
        break;
    }
    return color
  }

  getLanguage () {
    this.langId = getLangId()
  }

  totalPatchPrice() {
    const price = this.patches.reduce((acc, el ) => {
      return el.priceSum + acc
    }, 0)
    return numberFormatter(price)
  }

  patchPrice(price: number) {
    return numberFormatter(price)
  }

  created () {
    this.getLanguage()
  }

  beforeUpdate () {
    this.getLanguage()
  }
}
</script>

<style lang="scss" scoped>
.button-description {
  padding: 3px 6px 4px;
  font-size: 12px;
  text-transform: capitalize;
  font-weight: 300;
  line-height: 1;
}

.card-description {
  background-color: #fff;
  min-height: 200px;
  padding: 20px;
}
</style>

<i18n>
{
  "ru": {
    "not-found": "Описание не найдено",
    "description": "Описание",
    "availableForProcessing": "Тюнинг",
    "availableParameter": "Доступных параметров",
    "selectedFill": "Выбранные параметры",
    "selectedEmpty": "Параметры не выбраны",
    "price": "Стоимость",
    "free": "Бесплатно",
    "Eco": "Экология",
    "G2": "G2",
    "G2": "G2",
    "G2": "G2",
    "G5": "G5"
  },
  "en": {
    "not-found": "Description not found",
    "description": "More info",
    "availableForProcessing": "Chip Tuning",
    "availableParameter": "Available options",
    "selectedFill": "Selected options",
    "selectedEmpty": "Options are not selected",
    "price": "Price",
    "free": "Free",
    "Eco": "Ecology",
    "G2": "G2",
    "G3": "G3",
    "G4": "G4",
    "G5": "G5"
  }
}
</i18n>

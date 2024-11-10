<template lang="pug">
  .subscription-solution.buy-btn-panel
    .subscription-solution__text-wrap
      .subscription-solution__title {{$t("title")}}
      p.subscription-solution__text(v-html="getDesc()")
    .subscription-solution__button-wrap.buy-absolute-btn
      button.subscription-solution__button.button_blue.text(@click="getSolution" v-if="!isPricePage" :disabled="isLimit || isEmptyForm") {{$t("button")}}
      router-link.subscription-solution__button.button_blue.text( v-else :to="{ name: 'Order'}") {{$t("goToOrder")}}
    modal-download(
      v-if="showDownloadModal",
      :token="downloadToken",
      @close="closeDownloadModal"
      :isSecondTitle="true"
    )
</template>

<script lang="ts">
import "@/assets/styles/imports/subscription-solution.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import api from "@/api/index";
import ModalDownload from "@/components/_modal/ModalDownload.vue";
import getLangIdObject from "@/additionally/getLangIdObject";

@Component({
  components: {
    ModalDownload,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
    };
  },
})
export default class SubscriptionSolution extends Vue {
  @Prop({ type: Number, default: 0 }) readonly taskId!: number;
  @Prop({ type: Array }) readonly desc!: Array<any>;
  @Prop({ default: false }) readonly isPricePage!: any;
  @Prop({ default: false }) readonly isLimit!: any;
  @Prop({ type: Boolean, default: false }) readonly isEmptyForm!: boolean;

  downloadToken: any = null;
  showDownloadModal = false;

  getSolution(): any {
    this.$emit("save-task", {
      done: () => {
        api.subscription.processTask(this.taskId).then((response: any) => {
          if (response) {
            api.task.getDownloadLink(this.taskId).then((response: any) => {
              this.downloadToken = response;
              this.showDownloadModal = true;
              //api.firmware.downloadFile(response);
            });
          }
        });
      },
    });
  }

  openDownloadModal() {
    this.showDownloadModal = true;
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
  }

  getDesc(): void {
    return getLangIdObject(this.desc).descr;
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Получить решение по подписке.",
    "button": "Получить решение",
    "goToOrder": "К заказу"
  },
  "en": {
    "title": "Get the solution with subscription.",
    "button": "Get solution",
    "goToOrder": "Go to order"
  }
}
</i18n>

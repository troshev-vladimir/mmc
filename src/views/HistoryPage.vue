<template lang="pug">
.body
  the-history(@empty-history="empty = true")
  template(v-if="empty")
    the-history-empty
    how-works
  modal-download(
    v-if="showDownloadModal",
    :token="downloadToken",
    :method="downloadMethod"
    @close="closeDownloadModal"
  )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheHistory from "@/components/history/TheHistory.vue";
import TheHistoryEmpty from "@/components/history/TheHistoryEmpty.vue";
import ModalDownload from "@/components/_modal/ModalDownload.vue";
import HowWorks from "@/components/HowWorks.vue";
import storage from "@/storage";
import api from "@/api";

@Component({
  components: {
    ModalDownload,
    TheHistory,
    TheHistoryEmpty,
    HowWorks,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
      link: [
        {
          rel: 'canonical',
          hreflang: 'en-US',
          href: 'https://mmcflash.eu' + window.location.pathname
        },
        {
          rel: 'alternate',
          hreflang: 'ru-RU',
          href: 'https://mmcflash.ru' + window.location.pathname,
        },
      ],
    };
  },
})
export default class HistoryPage extends Vue {
  empty = false;
  showDownloadModal = false;
  downloadToken = "";

  downloadMethod: null | Function = null;

  async checkOpenDownloadModal() {
    let id;
    const lastPaymentId = sessionStorage.getItem("lastPaymentId");
    const lastPaymentType = storage.lastPaymentType;
    console.log("lastPaymentType", lastPaymentType);

    if (lastPaymentId) {
      id = JSON.parse(lastPaymentId).id;
      sessionStorage.setItem("lastPaymentId", "");
    }
    const taskId = id || storage.lastPaymentId;

    if (!taskId) return;
    storage.lastPaymentId = null;
    storage.lastPaymentType = null;
    console.log(lastPaymentType);

    if (lastPaymentType === "Stock") {
      const status = await api.stockFile.getPaymentStatus(taskId);
      if (status !== "Paid") return;
      const token = await api.stockFile.getDownloadToken(taskId);
      if (!token) return;
      this.downloadToken = token;
      this.downloadMethod = api.stockFile.downloadFile;
    } else {
      const status = await api.payment.getTaskStatus(taskId);
      if (status !== "Paid") return;
      const token = await api.task.getDownloadLink(taskId);
      if (!token) return;
      this.downloadToken = token;
    }

    this.openDownloadModal();
  }

  openDownloadModal() {
    this.showDownloadModal = true;
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
  }

  mounted() {
    this.checkOpenDownloadModal();
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Мои заказы"
  },
  "en": {
    "caption": "My orders"
  }
}
</i18n>

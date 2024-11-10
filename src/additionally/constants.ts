export const payForm = "mmcflash.payform.ru";
import { vxm } from '@/vuex'
export const intersectionRules = {
  threshold: 0.5,
  // rootMargin: '500px'
};
export const metaOg = [
  {
    property: "og:image",
    content: "https://mmcflash.ru/img/logommc.svg",
  },
  {
    property: "og:type",
    content: "article",
  },
  {
    property: "og:url",
    content: (vxm.user.lang === 'ru' ? 'https://mmcflash.ru' : 'https://mmcflash.eu')+window.location.pathname,
  },
  {
    property: "og:site_name",
    content: "MMCFlash",
  },
  {
    property: "og:image:width",
    content: "400",
  },
  {
    property: "og:image:height",
    content: "300",
  },
];

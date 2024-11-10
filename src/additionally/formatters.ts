import { vxm } from "@/vuex";
import getCurrencySymbol from "./getCurrencySymbol";
import moment from "moment";

export default function numberFormatter(
  num: string | number,
  isPrice = false
): string {
  const defaultCurrencyId = vxm.user.lang == "ru" ? 1 : 2;
  const currencyId =
    vxm.user.userIsAuth && vxm.user.user?.currencyId
      ? +vxm.user.user?.currencyId
      : defaultCurrencyId;
  const currencySymbol = getCurrencySymbol(currencyId);
  const lang = vxm.user.lang;
  const locale = lang === "ru" ? "ru-RU" : "en-US";

  let formattedNumber = "";

  if (lang === "ru") {
    formattedNumber = num
      .toLocaleString(locale)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } else {
    formattedNumber = num
      .toLocaleString(locale)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (isPrice) return formattedNumber + currencySymbol;

  return formattedNumber.toLocaleString();
}

export function dateFormatter(d: string, lang: string) {
  moment.locale(lang);
  // return moment(d).format('LL HH:mm')
  const format = lang === "ru" ? "DD.MM.YYYY HH:mm" : "YYYY/MM/DD h:mm A";
  return moment(d).format(format);
}

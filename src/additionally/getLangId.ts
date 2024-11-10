import i18n from "@/i18n";

export default function getLangId(): number {
  const lang = i18n.locale;
  if (lang === "en") return 2;
  return 1;
}

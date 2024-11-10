import getLangId from "./getLangId";

export default function getLangIdObject<Type>(infos: Array<Type>): any {
  return infos.find((info: any) => info.langId === getLangId());
}

export namespace DictionaryInterface {
  export interface Currency {
    id: number;
    name: string;
    isDeleted: boolean;
  }
  export interface Language {
    id: number;
    name: string;
    isDeleted: boolean;
  }
  export interface Country {
    id: number;
    name: string;
    nameShort: string;
    isDeleted: boolean;
  }
}

export namespace MmcStoreInterface {
  export interface Option {
    icon: string;
    descr: [
      {
        lang: string;
        value: string;
      },
    ];
  }
  export interface ModuleIds {
    lang: string;
    value: string;
  }
  export interface ModuleURL {
    lang: string;
    value: string;
  }
  export interface ModuleName {
    lang: string;
    value: string;
  }
  export interface ModulePrice {
    cur: string;
    price: number;
    oldPrice?: number;
  }
  export interface ModuleImages {
    lang: string;
    value: string;
  }
  export interface ModuleDescr {
    lang: string;
    value: string;
  }
  export interface Module {
    id: string;
    ids: Array<MmcStoreInterface.ModuleIds>;
    brands: Array<string>;
    options: Array<MmcStoreInterface.Option>;
    url: Array<MmcStoreInterface.ModuleURL>;
    names: Array<MmcStoreInterface.ModuleName>;
    price: Array<MmcStoreInterface.ModulePrice>;
    images: Array<MmcStoreInterface.ModuleImages>;
    descr: Array<MmcStoreInterface.ModuleDescr>;
  }
  export interface Info {
    brands: Array<string>;
    options: Array<MmcStoreInterface.Option>;
    modules: Array<MmcStoreInterface.Module>;
    isMmcKeyRequired: boolean;
    isDealer: boolean;
    mmcFlashKey?: string;
  }
  export interface Modules {
    items: Array<MmcStoreInterface.Module>;
    itemsCount: number;
  }
}

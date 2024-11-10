export namespace VehicleInterface {
  export interface Vehicle {
    id?: number;
    type: VehicleFilter;
    brand: VehicleFilter;
    model: VehicleFilter;
    engine: VehicleFilter;
    ecu: VehicleFilter;
    isOfflineSolution?: boolean;
    title?: string;
    description?: string;
    mmcKey?: string;
  }
  export interface VehicleFilter {
    title?: string;
    description?: string;
    id: number;
    name: string;
    isDeleted: boolean;
  }
  export interface Request {
    id?: number;
    typeId?: number;
    brandId?: number;
    modelId?: number;
    engineId?: number;
    ecuId?: number;
    searchPattern?: string;
    skip?: number;
    take?: number;
    brand?: string;
  }
}

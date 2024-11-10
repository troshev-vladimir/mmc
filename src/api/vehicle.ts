import { VehicleInterface } from "@/interfaces/vehicle";
import Request = VehicleInterface.Request;
import fetchWrapper from "./fetchWrapper";

export default class VehicleMethods {
  async postData<T>(url: string, params: Request) {
    return await fetchWrapper<T>(url, {}, "POST", params);
  }

  public async getVehicle(params: Request = {}): Promise<ResponseVehicle> {
    const data = await this.postData<ResponseVehicle>(
      "/api/Vehicle/GetVehicle",
      params
    );
    if (data) return data;
    return { itemsCount: 0, items: [] };
  }

  public async getVehicleType(
    params: Request = {}
  ): Promise<Array<VehicleInterface.VehicleFilter>> {
    const data = await this.postData<Array<VehicleInterface.VehicleFilter>>(
      "/api/Vehicle/GetVehicleType",
      params
    );
    if (data) return data;
    return [];
  }

  public async getVehicleBrand(
    params: Request = {}
  ): Promise<Array<VehicleInterface.VehicleFilter>> {
    const data = await this.postData<Array<VehicleInterface.VehicleFilter>>(
      "/api/Vehicle/GetVehicleBrand",
      params
    );
    if (data) return data;
    return [];
  }

  public async getVehicleModel(
    params: Request = {}
  ): Promise<Array<VehicleInterface.VehicleFilter>> {
    const data = await this.postData<Array<VehicleInterface.VehicleFilter>>(
      "/api/Vehicle/GetVehicleModel",
      params
    );
    if (data) return data;
    return [];
  }

  public async getVehicleEngine(
    params: Request = {}
  ): Promise<Array<VehicleInterface.VehicleFilter>> {
    const data = await this.postData<Array<VehicleInterface.VehicleFilter>>(
      "/api/Vehicle/GetVehicleEngine",
      params
    );
    if (data) return data;
    return [];
  }

  public async getVehicleEcu(
    params: Request = {}
  ): Promise<Array<VehicleInterface.VehicleFilter>> {
    const data = await this.postData<Array<VehicleInterface.VehicleFilter>>(
      "/api/Vehicle/GetVehicleEcu",
      params
    );
    if (data) return data;
    return [];
  }
}

interface ResponseVehicle {
  itemsCount: number;
  items: Array<VehicleInterface.Vehicle>;
}

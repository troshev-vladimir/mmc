import { UserInterface } from "@/interfaces/user";
import User = UserInterface.User;
import { Route } from "vue-router";
import { VehicleInterface } from "@/interfaces/vehicle";
import Vehicle = VehicleInterface.Vehicle;

class Storage {
  private getStorage(field: string) {
    const data = sessionStorage.getItem(field);
    if (data) return JSON.parse(data);
    return null;
  }

  // eslint-disable-next-line
  private setStorage(field: string, data: any) {
    if (data) sessionStorage.setItem(field, JSON.stringify(data));
    else sessionStorage.removeItem(field);
    window.dispatchEvent(new Event("storage"));
  }

  watch(cb: Function) {
    window.addEventListener("storage", () => {
      cb();
    });
  }

  get user(): User | null {
    return this.getStorage("user");
  }

  set user(user: User | null) {
    this.setStorage("user", user);
  }

  get lastVehicle(): Vehicle | null {
    return this.getStorage("lastVehicle");
  }

  set lastVehicle(vehicle: Vehicle | null) {
    this.setStorage("lastVehicle", vehicle);
  }

  get lastTaskVehicle(): Vehicle | null {
    return this.getStorage("lastTaskVehicle");
  }

  set lastTaskVehicle(vehicle: Vehicle | null) {
    this.setStorage("lastTaskVehicle", vehicle);
  }

  get pageFromLogin(): Route | null {
    return this.getStorage("pageFromLogin");
  }

  set pageFromLogin(route: Route | null) {
    this.setStorage("pageFromLogin", route);
  }

  get lastPaymentId(): number | string | null {
    const data = localStorage.getItem("lastPaymentId");
    if (data) return JSON.parse(data);
    return null;
  }

  set lastPaymentId(id: number | string | null) {
    if (id) localStorage.setItem("lastPaymentId", JSON.stringify(id));
    else localStorage.removeItem("lastPaymentId");
  }

  get lastPaymentType(): string | null {
    return localStorage.getItem("lastPaymentType");
  }

  set lastPaymentType(type: string | null) {
    if (type) localStorage.setItem("lastPaymentType", type);
    else localStorage.removeItem("lastPaymentType");
  }

  get lastFile(): { name: string; id: number } | null {
    return this.getStorage("lastFile");
  }

  set lastFile(file: { name: string; id: number } | null) {
    this.setStorage("lastFile", file);
  }
}

const storage = new Storage();

export default storage;

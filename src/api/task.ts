import { VehicleInterface } from "@/interfaces/vehicle";
import Vehicle = VehicleInterface.Vehicle;
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;
import Tasks = TaskInterface.Tasks;
import Histories = TaskInterface.Histories;
import fetchWrapper from "./fetchWrapper";

export default class TaskMethods {
  public async getView(params: GetParams): Promise<Histories | undefined> {
    return await fetchWrapper<Histories>(
      "/api/Task/GetView",
      {},
      "POST",
      params
    );
  }

  public async get(params: GetParams): Promise<Tasks | undefined> {
    return await fetchWrapper<Tasks>("/api/Task/Get", {}, "POST", params);
  }

  public async edit(params: EditParams): Promise<Task | undefined> {
    return await fetchWrapper<Task>("/api/Task/Edit", {}, "POST", params);
  }

  public async preview(
    vehicle: Vehicle,
    lang: string
  ): Promise<Task | undefined> {
    return await fetchWrapper<Task>("/api/Task/Preview", {}, "POST", {
      vehicle,
      lang,
    });
  }

  public async save(task: Task): Promise<Task | undefined> {
    return await fetchWrapper<Task>("/api/Task/Save", {}, "POST", task);
  }

  public async calcPriceV2(params: Task): Promise<Task | undefined> {
    return await fetchWrapper<Task>(
      "/api/Task/CalcPriceV2",
      {},
      "POST",
      params
    );
  }

  public async process(taskId: number): Promise<void> {
    await fetchWrapper<Task>("/api/Task/Process", {}, "POST", { taskId });
  }

  public async getDownloadLink(taskId: number): Promise<string | undefined> {
    return await fetchWrapper<string>("/api/Task/GetDownloadLink", {}, "POST", {
      taskId,
    });
  }
}

interface GetParams {
  taskCreatedFrom?: string;
  taskCreatedTo?: string;
  searchPattern?: string;
  taskStatus?: string;
  skip?: number;
  take?: number;
}

export interface EditParams {
  taskId?: number;
  fileId?: number;
  vehicle?: Vehicle;
}

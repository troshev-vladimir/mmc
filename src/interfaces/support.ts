import { TaskInterface } from "@/interfaces/task";

export namespace SupportInterface {
  export interface SelectOption {
    infos: Array<TaskInterface.Infos>;
    messageTypeId: number;
    messageTypeName: string;
  }
}

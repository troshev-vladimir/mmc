import { SupportInterface } from "@/interfaces/support";
import fetchWrapper from "./fetchWrapper";

export default class SupportMethods {
  public async getMessageTypes(
    requestType: string
  ): Promise<Array<SupportInterface.SelectOption>> {
    return await fetchWrapper<Array<SupportInterface.SelectOption>>(
      `/api/Support/GetMessageTypes`,
      {},
      "POST",
      { requestType }
    );
  }

  public async open(
    taskId: number,
    messageTypeId: number,
    question: string,
    viewType: string
  ): Promise<any> {
    return await fetchWrapper<any>(`/api/Support/open`, {}, "POST", {
      taskId: taskId,
      messageTypeId: messageTypeId,
      question: question,
      viewType: viewType,
    });
  }
}

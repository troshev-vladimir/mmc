import api from "@/api";
import { OrderInterface } from "@/interfaces/order";
import Order = OrderInterface.Order;
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;

type Method = "create" | "fromTask";

async function orderFactory(
  method: Method,
  arg?: Task
): Promise<Order | undefined> {
  switch (method) {
    case "create":
      return await api.order.create();
    case "fromTask":
      if (!arg) return;
      return await api.order.getFromTask(arg);
    default:
      return;
  }
}

export default orderFactory;

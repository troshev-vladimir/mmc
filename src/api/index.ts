import VehicleMethods from "@/api/vehicle";
import AuthorizeMethods from "@/api/authorize";
import DictionaryMethods from "@/api/dictionary";
import TaskMethods from "@/api/task";
import FirmwareMethods from "@/api/firmware";
import NewMethods from "@/api/new";
import QuestionsMethods from "@/api/questions";
import PaymentMethods from "@/api/payment";
import BalanceMethods from "@/api/balance";
import SupportMethods from "@/api/support";
import SubscriptionMethods from "@/api/subscription";
import MmcStoreMethods from "@/api/mmc-store";
import MmcMethods from "@/api/mmc";
import OrderMethods from "@/api/order";
import stockFile from "@/api/stockFile";

const baseURL: string = process.env.VUE_APP_API_URL || "";
if (!baseURL) console.warn("Base API url not found");

class API {
  public authorize: AuthorizeMethods = new AuthorizeMethods();
  public vehicle: VehicleMethods = new VehicleMethods();
  public dictionary: DictionaryMethods = new DictionaryMethods(baseURL);
  public task: TaskMethods = new TaskMethods();
  public firmware: FirmwareMethods = new FirmwareMethods(baseURL);
  public news: NewMethods = new NewMethods();
  public queastions: QuestionsMethods = new QuestionsMethods();
  public payment: PaymentMethods = new PaymentMethods();
  public balance: BalanceMethods = new BalanceMethods();
  public support: SupportMethods = new SupportMethods();
  public subscription: SubscriptionMethods = new SubscriptionMethods();
  public mmcStore: MmcStoreMethods = new MmcStoreMethods(baseURL);
  public mmc: MmcMethods = new MmcMethods(baseURL);
  public order: OrderMethods = new OrderMethods();
  public stockFile: stockFile = new stockFile();
}

const api = new API();

export default api;

import fetchWrapper from "./fetchWrapper";
import { Balance } from "@/interfaces/balance";
import type { PaymentScriptParams } from "./payment";
import { vxm } from "@/vuex";

export default class BalanceMethods {
  public async getBalance(
    skip?: number,
    take?: number
  ): Promise<Balance.BalanceResponce | undefined> {
    return await fetchWrapper<Balance.BalanceResponce>(
      "/api/Balance/GetBalance",
      {},
      "POST",
      { skip, take }
    );
  }

  public async getTrancactions(
    params: Balance.TrancactionsParams
  ): Promise<Balance.TrancactionsResponce | undefined> {
    return await fetchWrapper<Balance.TrancactionsResponce>(
      "/api/Balance/GetTransactions",
      {},
      "POST",
      params
    );
  }

  public async getPaymentScriptParams(
    params: Balance.ScriptparamsParams
  ): Promise<PaymentScriptParams<typeof params.provider> | undefined> {
    return await fetchWrapper<PaymentScriptParams<typeof params.provider>>(
      "/api/Balance/GetPaymentScriptParams",
      {},
      "POST",
      params
    );
  }

  public async openSupport(
    params: Balance.OpenSupportParams
  ): Promise<null | undefined> {
    return await fetchWrapper<null>(
      "/api/Balance/OpenSupport",
      {},
      "POST",
      params
    );
  }

  public async checkPayStatus(documentId: number): Promise<string | undefined> {
    return await fetchWrapper<string>(
      "/api/Balance/CheckPayStatus",
      {},
      "POST",
      { documentId }
    );
  }

  async setBalance() {
    const response = await this.getBalance();
    const usersBalanceItems = response?.items || [];
    const usersCurrencyId = vxm.user.user?.currencyId;
    const balanceAmount = usersBalanceItems.find((currency) => {
      return currency.currencyId === usersCurrencyId;
    })?.amount;
    if (typeof balanceAmount === "undefined") return;
    vxm.user.setBalance(balanceAmount);
  }
}

import type { PaymentScriptParams } from "@/api/payment";

export default async function openLavaTopPayment(
  getParams: () => Promise<PaymentScriptParams<"LavaTop"> | null | undefined>,
  isCancelled: () => boolean = () => false
): Promise<PaymentScriptParams<"LavaTop"> | null> {
  const paymentWindow = window.open("about:blank", "_blank");
  if (!paymentWindow) throw new Error("popup-blocked");

  try {
    paymentWindow.opener = null;
    const params = await getParams();

    if (isCancelled() || params === null || paymentWindow.closed) {
      paymentWindow.close();
      return null;
    }

    if (
      !params ||
      typeof params !== "object" ||
      !Number.isInteger(params.documentId) ||
      params.documentId <= 0 ||
      typeof params.paymentUrl !== "string" ||
      !/^https:\/\//i.test(params.paymentUrl)
    ) {
      throw new Error("invalid-payment-response");
    }

    let paymentUrl: URL;
    try {
      paymentUrl = new URL(params.paymentUrl);
    } catch {
      throw new Error("invalid-payment-response");
    }
    if (
      paymentUrl.protocol !== "https:" ||
      paymentUrl.username ||
      paymentUrl.password
    ) {
      throw new Error("invalid-payment-response");
    }

    paymentWindow.location.href = paymentUrl.href;
    return params;
  } catch (error) {
    paymentWindow.close();
    throw error;
  }
}

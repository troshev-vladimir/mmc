const requestCount = 120;

export default async function checkPaymentStatus(
  id: number | string,
  cb: Function,
  options: {
    trackRobokassaFocus?: boolean;
    isCancelled?: () => boolean;
  } = {}
): Promise<boolean> {
  const { trackRobokassaFocus = true, isCancelled = () => false } = options;
  let runPaymentTimer = true;
  let requestTimer: ReturnType<typeof setTimeout> | undefined;
  let focusTimer: ReturnType<typeof setTimeout> | undefined;

  function checkFocus() {
    if (document.activeElement === document.querySelector("#robokassa_iframe")) {
      if (focusTimer !== undefined) clearTimeout(focusTimer);
      focusTimer = undefined;
    } else {
      document.dispatchEvent(new Event("closeRobokassaIframe"));
      if (focusTimer === undefined) {
        focusTimer = setTimeout(() => {
          runPaymentTimer = false;
        }, 20000);
      }
    }
  }

  try {
    for (let i = 0; i < requestCount; i++) {
      if (isCancelled() || !runPaymentTimer) return false;
      const status = await cb(id);
      if (isCancelled() || !runPaymentTimer) return false;

      if (status === "Paid") return true;
      if (i === requestCount - 1 || status === "Error") return false;

      await new Promise<void>((resolve) => {
        requestTimer = setTimeout(resolve, 4000);
      });
      requestTimer = undefined;
      if (isCancelled() || !runPaymentTimer) return false;
      if (trackRobokassaFocus) checkFocus();
    }

    return false;
  } finally {
    if (requestTimer !== undefined) clearTimeout(requestTimer);
    if (focusTimer !== undefined) clearTimeout(focusTimer);
  }
}

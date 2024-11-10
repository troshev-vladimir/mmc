const requestCount = 120;
let runPaymentTimer = true;
function timeout(): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(resolve, 4000);
  });
}

function checkFocus() {
  if (document.activeElement == document.querySelector("#robokassa_iframe")) {
    console.log("iframe has focus");
    runPaymentTimer = true;
  } else {
    const event = new Event("closeRobokassaIframe");
    document.dispatchEvent(event);
    setTimeout(() => {
      runPaymentTimer = false;
    }, 20000);
  }
}

export default async function checkPaymentStatus(
  id: number | string,
  cb: Function
): Promise<boolean> {
  runPaymentTimer = true;

  for (let i = 0; i < requestCount; i++) {
    if (!runPaymentTimer) return false;
    const status = await cb(id);

    if (status === "Paid") return true;

    if (i === requestCount - 1 || status === "Error") return false;

    await timeout();
    if (status === "Paid") return true;
    checkFocus();
  }

  return false;
}

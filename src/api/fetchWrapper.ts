import { vxm } from "@/vuex";
const customError = new Error(
  vxm.user.lang === "ru" ? "Что то пошло не так." : "Something went wrong"
);
const evt = new CustomEvent("customerror", { detail: { error: customError } });

function fetchWrapper<T>(
  link: string,
  query = {},
  method = "GET",
  body: object | null = {}
): Promise<T> {
  const href = process.env.VUE_APP_API_URL + link;

  const url = new URL(href);
  Object.keys(query).forEach((param) =>
    url.searchParams.set(param, query[param])
  );

  return fetch(String(url), {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: method === "POST" && body ? JSON.stringify(body) : null,
  })
    .catch((error) => {
      window.dispatchEvent(evt);
      throw customError;
    })
    .then((res) => {
      if (res.ok) return res.json();
      else {
        window.dispatchEvent(evt);
        throw new Error("Ошибка на сервере, ничего не вернулось");
      }
    })
    .then(
      (response) => {
        if (response.failure) {
          const evt = new CustomEvent("customerror", {
            detail: { error: response.failure },
          });
          window.dispatchEvent(evt);
          throw response.failure;
        }
        if (response.success) return response.success;
      },
      (error) => {
        if (error.message) throw error;
        throw new Error(
          vxm.user.lang === "ru"
            ? "Что-то пошло не так"
            : "Something went wrong"
        );
      }
    );
}

export default fetchWrapper;

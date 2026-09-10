# LavaTop

Фронтенд поддерживает прямую оплату покупок и пополнение баланса через LavaTop.
Платёж открывается в новой вкладке. Исходная страница опрашивает существующий
статус покупки каждые 4 секунды, до 120 запросов. Только ответ `Paid` завершает
оплату в интерфейсе. Закрытие модалки отменяет ожидание; платёж на сервере
при этом не отменяется. По истечении ожидания пользователь получает сообщение
о неподтверждённой оплате и может проверить баланс или историю заказов.

## Контракт backend

В существующий `GetPaymentScriptParams` передаётся `provider: "LavaTop"`.
Ожидаемый HTTP JSON-ответ:

```json
{
  "success": {
    "paymentUrl": "https://example.com/checkout",
    "documentId": 12345
  }
}
```

`documentId` — положительный целочисленный ID внутреннего платёжного документа
(`paymentDocId`), который принимают методы проверки статуса ниже.
`paymentUrl` — абсолютная HTTPS-ссылка на оплату. UUID инвойса LavaTop остаётся
на backend в `PaymentDoc.ExternalId`.

| Покупка в модалке | Получение параметров (POST) | Проверка статуса | ID проверки |
| --- | --- | --- | --- |
| Order | /api/Payment/GetPaymentScriptParams | GET /api/YaPayment/GetTaskStatus | исходный taskId |
| Task | /api/Order/GetPaymentScriptParams | POST /api/Order/CheckPaymentStatus | исходный documentId заказа |
| Subscription | /api/Subscription/GetPaymentScriptParams | POST /api/Subscription/CheckPayStatus | documentId из ответа |
| Mmc / Hardware | /api/MmcStore/GetPaymentScriptParams | POST /api/MmcStore/CheckPayStatus | documentId из ответа, поле invId |
| Stock | /api/StockFilePayment/GetPaymentScriptParams | POST /api/StockFilePayment/CheckPayStatus | documentId из ответа |
| Пополнение | /api/Balance/GetPaymentScriptParams | POST /api/Balance/CheckPayStatus | documentId из ответа |

У пополнения сохраняется существующее имя поля суммы `amonth`.

## Изменение приложенного C# провайдера

В этом репозитории нет C# проекта. Приложенный `ProviderLavaTop` пока возвращает
строку `PaymentUrl`. Перед проверкой интеграции на сервере необходимо изменить
его результат:

```csharp
public sealed record LavaTopPaymentScriptParams(
    [property: JsonPropertyName("paymentUrl")] string PaymentUrl,
    [property: JsonPropertyName("documentId")] int DocumentId);

// Вместо Task<string>:
public async Task<LavaTopPaymentScriptParams> GetScriptParamsAsync(
    string note,
    string currencyName,
    int paymentDocId,
    OrderItem[] items,
    string userEmail,
    string userPhoneNumber)
{
    // Существующее создание и сохранение инвойса, проверки ответа.
    // Вместо return invoice.PaymentUrl:
    return new LavaTopPaymentScriptParams(invoice.PaymentUrl, paymentDocId);
}
```

Это фрагмент изменения, не замена тела метода. Синхронный `object GetScriptParams`
может сохранить текущую сигнатуру. Публичные endpoints должны поместить DTO
в `success` как объект, без повторной сериализации в строку.

Также на backend необходимо:

- Зарегистрировать `ProviderLavaTop` в общем выборе провайдера для нужных покупок.
- Указать реальный `OfferId`, исходящий API-ключ, отдельный `WebhookApiKey`.
- Подключить `/api/LavaTop/Callback` из предоставленного контроллера и настроить
  адреса возврата. Возврат пользователя сам по себе не подтверждает оплату;
  не использовать `paymentStatus=success` на BalancePage как доказательство оплаты.
- Проверить, что общий обработчик зачисляет деньги/выдаёт покупку один раз,
  а повторный валидный webhook успешно подтверждает без повторной выдачи.
- Для повторного открытия неоплаченного инвойса возвращать прежнюю ссылку:
  сейчас приложенный код выбрасывает `InvoiceAlreadyCreated` при заполненном
  `ExternalId`. Ссылку нужно сохранять либо восстанавливать через API провайдера.

## Проверка

```text
node tests/payment.test.cjs
node tests/lavatop-modal.test.cjs
node tests/lavatop-foreign.test.cjs
npm run test -- --dest dist/lavatop-check
```

Модульные проверки используют подставные ответы и не создают реальные платежи.
После установки backend-контракта проверить прямую покупку каждого типа и
пополнение в RUB/USD/EUR: успешную оплату, ошибку, задержку webhook, повторное
открытие, закрытие формы во время запроса и блокировку новой вкладки браузером.

!(function (e) {
  var t = {}
  function o(n) {
    if (t[n]) return t[n].exports
    var r = (t[n] = {
      i: n,
      l: !1,
      exports: {},
    })
    return e[n].call(r.exports, r, r.exports, o), (r.l = !0), r.exports
  }
  ;(o.m = e),
    (o.c = t),
    (o.d = function (e, t, n) {
      o.o(e, t) ||
        Object.defineProperty(e, t, {
          enumerable: !0,
          get: n,
        })
    }),
    (o.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, {
          value: 'Module',
        }),
        Object.defineProperty(e, '__esModule', {
          value: !0,
        })
    }),
    (o.t = function (e, t) {
      if ((1 & t && (e = o(e)), 8 & t)) return e
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e
      var n = Object.create(null)
      if (
        (o.r(n),
        Object.defineProperty(n, 'default', {
          enumerable: !0,
          value: e,
        }),
        2 & t && 'string' != typeof e)
      )
        for (var r in e)
          o.d(
            n,
            r,
            function (t) {
              return e[t]
            }.bind(null, r)
          )
      return n
    }),
    (o.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e['default']
            }
          : function () {
              return e
            }
      return o.d(t, 'a', t), t
    }),
    (o.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }),
    (o.p = '/Merchant/bundle/'),
    o((o.s = 424))
})({
  424: function (e, t) {
    var o = {
        overflow: '',
        position: '',
        width: '',
      },
      n = []
    var r = document.createElement('iframe')
    r.setAttribute('id', 'robokassa_iframe'),
      r.setAttribute('name', 'robokassa_iframe'),
      r.setAttribute(
        'style',
        'border:0;width:100%;height:100%;overflow:hidden;background-color:transparent;position:fixed;top:0;visibility:hidden;z-index:2147483647;'
      ),
      r.setAttribute('allowTransparency', 'true'),
      document.body.appendChild(r),
      (window.Robokassa = new (function () {
        ;(this.OpenPaymentForm = function () {
          ;(document.getElementById('robokassa_iframe').style.visibility =
            'visible'),
            (window.robokassa_bodyStyle = document.body.style),
            (o.overflow = document.body.style.overflow),
            (o.position = document.body.style.position),
            (o.width = document.body.style.width),
            (document.body.style.overflow = 'hidden'),
            (document.body.style.position = 'fixed'),
            (document.body.style.width = '100%'),
            (function () {
              for (var e = document.body.children, t = 0; t < e.length; t++)
                'robokassa_iframe' !== e[t].getAttribute('id') &&
                  ((n[t] = e[t].style.filter),
                  (e[t].style.filter = 'blur(5px)'))
            })()
        }),
          (this.ClosePaymentForm = function () {
            var e = document.getElementById('robokassa_iframe')
            ;(e.style.visibility = 'hidden'),
              (e.src = ''),
              (document.body.style.overflow = o.overflow),
              (document.body.style.position = o.position),
              (document.body.style.width = o.width),
              (function () {
                for (var e = document.body.children, t = 0; t < e.length; t++)
                  'robokassa_iframe' !== e[t].getAttribute('id') &&
                    (e[t].style.filter = n[t])
              })()
            document.querySelector('form[target="robokassa_iframe"]').remove()
          }),
          (this.StartPayment = function (e) {
            if (e && 0 !== e.length) {
              var t = document.createElement('form')
              for (var o in ((t.action =
                'https://auth.robokassa.ru/Merchant/v1/iframe'),
              (t.method = 'POST'),
              t.setAttribute('target', 'robokassa_iframe'),
              e)) {
                var n = document.createElement('input')
                ;(n.type = 'hidden'),
                  (n.name = o),
                  (n.value = e[o]),
                  t.appendChild(n)
              }
              document.body.appendChild(t), t.submit(), this.OpenPaymentForm()
            }
          })
      })()),
      window.addEventListener(
        'message',
        function (e) {
          if ('https://auth.robokassa.ru' !== e.origin) return // void console.error("Unknown origin '".concat(e.origin, "'"));
          switch (e.data.action) {
            case 'closeRobokassaFrame':
              window.Robokassa.ClosePaymentForm()
              break
            case 'redirectToRobokassa':
              e.data.redirectUrl && (window.location.href = e.data.redirectUrl)
          }
        },
        !1
      )
  },
})

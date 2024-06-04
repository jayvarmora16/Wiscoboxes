if ("object" != Ms && void 0 === Ms) var Ms = function() {
    var k = {},
        h = {},
        l = {},
        my_appUrl="https://wiscowisco.com/wiscoboxes",
        m, r = new Promise(function(b, a) {
            m = "/apps/mutiship/";
            b("/apps/mutiship/")
        }),
        t = function(b) {
            b += "=";
            for (var a = document.cookie.split(";"), c = 0; c < a.length; c++)
                if (0 != a[c]) {
                    for (var d = a[c];
                        " " == d.charAt(0);) d = d.substring(1, d.length);
                    if (0 == d.indexOf(b)) return d.substring(b.length, d.length)
                } return null
        },
        n = function() {
            if ("/cart" === window.location.pathname || "/cart/" === window.location.pathname) return "cart";
            if (meta.product && meta.product.id) return "product";
            if (window.location.pathname === m + "cart" || window.location.pathname === m + "cart/") return "ms_cart"
        }(),
        p = function() {
            for (var b = "", a = 0; 2 > a; a++) b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
            return b
        },
        u = function(b) {
            var a = document.createElement("link"),
                c = document.getElementsByTagName("head")[0];
            a.rel = "stylesheet";
            a.type = "text/css";
            a.href = "https://wiscowisco.com/wiscoboxes/public/css/multiship.global.1.0.0.css";
            c.appendChild(a);
            return new Promise(function(a, c) {
                a(b)
            })
        },
        v = function() {
            var b = document.getElementById("ms__toggle-shipping"),
                a = document.querySelectorAll('form[action^="/cart"], form[action*=" /cart"], form[action^="https://' + document.location.hostname + '/cart"], form[action^="//' + document.location.hostname + '/cart"]')[0];
            if ("cart" !== n || meta.product) return !1;
            if (!b && a) {
                b = document.createElement("div");
                var c = document.createElement("p"),
                    d = document.createElement("input"),
                    f = document.createElement("label");
                b.style["background-color"] = l.toggle_color;
                b.id = "ms__toggle-box";
                d.type = "checkbox";
                d.id = "ms__toggle-shipping";
                d.value = "Ship to Multiple";
                f["for"] = "ms__toggle-shipping";
                f.innerHTML = l.toggle_text;
                c.appendChild(d);
                c.appendChild(f);
                b.appendChild(c);
                a.insertBefore(b, a.children[0])
            }
        },
        q = function(b) {
            var a = document.getElementsByClassName("btn");
            ms__settings = JSON.parse(JSON.stringify(b));
            h = b.options;
            l = h.multishipping;
            if ("" !== h.global.button_class) {
                var c = null !== a ? a.length : 0;
                for (i = 0; i < c; i++) a[i].className += " " + h.global.button_class
            }
            h.global.animate_modal && 0 != h.global.animate_modal ||
                (document.body.className += " ms__no-animation");
            return b
        },
        w = new Promise(function(b, a) {
            var c = new XMLHttpRequest;
            c.open("GET", "/cart.js");
            c.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            c.onload = function() {
                if (200 === c.status) {
                    var d = JSON.parse(c.responseText);
                    b(d)
                } else a(Error("Cart data did not load"))
            };
            c.send()
        }),
        x = function(b) {
            var a = (new Date).getTime(),
                c = parseInt(window.localStorage.getItem("ms__expire")) + 3E5;
            return new Promise(function(d, f) {
                if (null !== window.localStorage.getItem("ms__settings") &&
                    a < c) k = window.localStorage.getItem("ms__settings"), k = JSON.parse(k), k = q(k), d(k);
                else {
                  console.log(my_appUrl+ "/settings?shop="+window.Shopify.shop);
                    var e = new XMLHttpRequest;
                    e.open("GET", my_appUrl+ "/settings?shop="+window.Shopify.shop,true);
                   // e.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    e.onload = function() {
                        if (200 === e.status) {
                            console.log(e);
                            var b = JSON.parse(e.responseText);
                            b = q(b);
                            h.global && !h.global.disable_caching && window.localStorage.setItem("ms__expire", a);
                            window.localStorage.setItem("ms__settings", JSON.stringify(ms__settings));
                            d(b)
                        } else f(Error("Giftships settings did not load correctly"))
                    };
                    e.send()
                }
            })
        },
        y = function(b, a, c, d, f) {
            c = parseInt(c);
            p();
            b = {
                line: b,
                properties: a,
                quantity: c
            };
            var e = new XMLHttpRequest;
            e.open("POST", "/cart/change.js?_rand=" + p());
            e.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            e.onload = function() {
                if (200 === e.status) {
                    var a = JSON.parse(e.responseText);
                    d(a)
                } else f(e)
            };
            e.send(JSON.stringify(b))
        },
        z = function(b) {
            for (var a, c, d = [], f = 0; f < b.items.length; f++)
                if (a = b.items[f].properties || {}, c = f + 1, a.Address) {
                    var e = b.items[f].quantity,
                        g;
                    for (g in a) a.hasOwnProperty(g) &&
                        (0 <= g.indexOf("empty") || 0 <= g.indexOf("National Tax") || "Shipping" === g || "Ships With" === g || 0 <= g.indexOf("Regional Tax") || "Address" === g ? delete a[g] : ("" === g || void 0 === g || null === g) && delete a[g]);
                    d.push({
                        ln: c,
                        quantity: e,
                        lp: a
                    })
                } if (!d) return !1;
            var h = function() {
                if (!d.length) return !1;
                var a = d.shift();
                y(a.ln, a.lp, a.quantity, function(a) {
                    h()
                })
            };
            h()
        };
    (function(b) {
        r.then(x).then(u).then(function(a) {
            if (!h.global.enable_multiship) return console.warn("Multiship is disabled. Please enable this in the application settings."),
                !1;
            l.enable && v();
            "cart" === n && "ms_cart" === t("current_ms_state") && w.then(function(a) {
                z(a)
            })["catch"](function(a) {
                console.log(a)
            });
            b(a)
        })
    })(function(b) {
        if (b = document.getElementById("ms__toggle-shipping")) b.onclick = function() {
            var a = new Date;
            a.setTime(a.getTime() + 864E5);
            a = "; expires=" + a.toUTCString();
            document.cookie = "current_ms_state=ms_cart" + a + "; path=/";
            window.location = "https://" + document.location.hostname + m + "appdata"
        }
    })
}();

/*alert();*/
// jQuery( document ).ready(function() {
  
// 	jQuery("tr[data-variantid=39352806965357]").closest('tr').next().hide();
  
// });
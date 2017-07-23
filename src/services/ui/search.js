/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.search = {
    init: function() {
        qwp.search.fill();
    },
    fill: function(s) {
        if (!s && qwp.page) s = qwp.page.search || false;
        if (!s) return;
        for (var n in s) {
            var fields = $("input[name='s[" + n + "]']");
            if (fields.length > 0) {
                fields.val(s[n]);
                continue;
            }
            fields = $("textarea[name='s[" + n + "]']");
            if (fields.length > 0) {
                fields.val(s[n]);
                continue;
            }
            fields = $("select[name='s[" + n + "]']");
            if (fields.length > 0) {
                fields.val(s[n]);
            }
        }
    },
    attach: function(f, opt) {
        var fn = opt && opt['fetchData'] ? opt['fetchData'] : false;
        if (fn) {
            fn = qwp.$fn(fn);
            if (!fn) fn = $h.anon(f, 'search');
        }
        $(f + " button[type='submit']").click(function(){
            var p = $(f).serialize();
            if (p.length === 0) return false;
            if (fn) {
                window[fn](1,0,0,0,p);
            } else {
                qwp.to(qwp.uri.baseUrl, p);
            }
            return false;
        });
        $(f + " button[type='reset']").click(function() {
            if (fn) {
                window[fn](1, 0, 0, 0, 0);
            } else {
                qwp.to(qwp.uri.baseUrl);
            }
        });
    }
};
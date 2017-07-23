/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.loading = {
    line: {
        create: function(container) {
            $(container).prepend(qwp.loading.line.tmpl());
        },
        show: function(container) {
            if (qwp.loading.line.timer[container]) return;
            $(container + ">div[qwp='line-loading']").css('display', 'block');
            var p = 0;
            qwp.loading.line.timer[container] = setInterval(function() {
                if (p > 100) p = 100;
                var w = $(container).width();
                w = Math.round(p * w / 100);
                $(container + ">div[qwp='line-loading'] table").attr('width', w + 'px');
                p += 2;
                if (p > 100) p = 0;
            }, 200);
        },
        hide: function(container) {
            if (!qwp.loading.line.timer[container]) {
                return;
            }
            $(container + ">div[qwp='line-loading'] table").attr('width', '0px');
            $(container + ">div[qwp='line-loading']").css('display', 'none');
            clearInterval(qwp.loading.line.timer[container]);
            qwp.loading.line.timer[container] = false;
        },
        tmpl: function() {
            return '<div class="line-loading" style="display: none;" qwp="line-loading"><table class="line-loading" style="background-color:#2796e5" width="0px"></table></div>';
        },
        timer: {}
    },
    gif:{
        create: function(container, src, pos) {
            if (!pos) pos = 'top';
            if (!src) src = 'img/loading_small.gif';
            var h = qwp.loading.gif.tmpl().format(src);
            if (pos == 'top') $(container).prepend(h);
            else $(container).append(h);
        },
        show: function(container) {
            $(container + ">div[qwp='gif-loading']").css('display', 'block');
        },
        hide: function(container) {
            $(container + ">div[qwp='gif-loading']").css('display', 'none');
        },
        tmpl: function() {
            return '<div class="gif-loading" style="display: none;" qwp="gif-loading"><img src="{0}" border="0"></div>';
        }
    },
    overlay:{
        create: function(container, html) {
            if (!html) html = '';
            $(container).prepend(qwp.loading.overlay.tmpl().format(html));
        },
        show: function(container, calcSize) {
            var o = $(container + ">div[qwp='overlay-loading']");
            if (calcSize) {
                o.removeClass('overlay-loading').css({position:'absolute','z-index':'998','background-color': 'rgba(255,255,255,0.5)'});
                qwp.ui.sameSize(o, $(container));
            } else {
                if (!o.hasClass('overlay-loading')) o.addClass('overlay-loading');
            }
            o.css('display', 'block');
        },
        hide: function(container) {
            $(container + ">div[qwp='overlay-loading']").css('display', 'none');
        },
        tmpl: function() {
            return '<div class="overlay-loading" style="display: none;" qwp="overlay-loading">{0}</div>';
        }
    }
};

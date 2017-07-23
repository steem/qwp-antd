/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
function $img(src) {
    var m = new Image();
    m.src = src;
    return m;
}
if (top == window) {
    qwp.loadingImg = $img('img/loading_small.gif');
}
if (typeof String.prototype.format != 'function') {
    String.prototype.format = function() {
        var s = this;
        if (arguments.length === 0) return s;
        if ($.isPlainObject(arguments[0])) {
            for (var p in arguments[0]) {
                s = s.replace(new RegExp("\\{" + p + "\\}", "g"), arguments[0][p]);
            }
            return s;
        }
        for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return s;
    };
}
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function() {
        return this.replace(/(^\s+)|(\s+$)/g, "");
    };
}
if (typeof String.prototype.ltrim != 'function') {
    String.prototype.ltrim = function() {
        return this.replace(/(^\s+)/g, "");
    };
}
if (typeof String.prototype.rtrim != 'function') {
    String.prototype.rtrim = function() {
        return this.replace(/(\s+$)/g, "");
    };
}
if (typeof Date.prototype.toLocalTime != 'function') {
    Date.prototype.toLocalTime = function(fmt) {
        var d = this;
        var o = {
            "M+" : d.getMonth()+1,
            "d+" : d.getDate(),
            "h+" : d.getHours(),
            "m+" : d.getMinutes(),
            "s+" : d.getSeconds(),
            "q+" : Math.floor((d.getMonth()+3)/3),
            "S"  : d.getMilliseconds()
        };
        if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
        return fmt;
    }
}
// return function name if it's global function
qwp.$fn = function(fn) {
    var t = $.type(fn);
    if (t == 'string') return fn;
    if (t != 'function') return false;
    var s = fn.toString().substr(8);
    t = s.indexOf('{');
    if (t == -1) return false;
    s = s.substr(0, t - 1).trim();
    t = s.indexOf('(');
    if (t != -1) s = s.substr(0, t);
    if (!s.length || s == 'anonymous') return false;
    return window[s] ? s : false;
};
function $noop() {}
function $false() {return false;}
function $L(txt) {
    if (_LANG && _LANG[txt]) txt = _LANG[txt];
    if (arguments.length == 1) return txt;
    for (var i = 1, cnt = arguments.length; i < cnt; ++i) {
        var idx = i - 1;
        txt = txt.replace(new RegExp("\\{" + idx + "\\}", "gm"), arguments[i]);
    }
    return txt;
}
$h = {};
(function($, $h){
    $h.anonymousIndex = 1;
    $h.anon = function(fn, prefix) {
        if (!prefix) prefix = 'anon';
        prefix = 'qwp_' + prefix + '_' + $h.anonymousIndex;
        ++$h.anonymousIndex;
        window[prefix] = fn;
        return prefix;
    };
    $h.attr = function(attrs, sep, eq, vtag) {
        if (!attrs) {
            return '';
        }
        sep = sep || ' ';
        eq = eq || '=';
        if ($.type(vtag) == 'undefined') vtag = '"';
        var at = ' ', preSep = '';
        for (var k in attrs) {
            var v = attrs[k];
            if (v === true) {
                at += preSep + k;
                continue;
            }
            var t = $.type(v), d;
            if (t == 'function') {
                if (k != 'onclick') {
                    continue;
                }
            }
            if (t == 'object') {
                var t1 = ';', t2 = ':', t3 = '', vt = {};
                $.extend(vt, v);
                if (vt._sep) {
                    t1 = vt._sep;
                    delete vt._sep;
                }
                if (vt._eq) {
                    t2 = vt._eq;
                    delete vt._eq;
                }
                if (vt._vtag) {
                    t3 = vt._vtag;
                    delete vt._vtag;
                }
                d = $h.attr(vt, t1, t2, t3);
            } else {
                if (k == 'onclick') {
                    d = qwp.$fn(v);
                    if (d) {
                        if (d.indexOf('(') == -1) d += '()';
                    } else {
                        d = $h.anon(v) + '()';
                    }
                } else {
                    d = '' + v;
                }
            }
            at += preSep + k + eq + vtag + d + vtag;
            preSep = sep;
        }
        return at;
    };
    $h.ele = function(tag, txt, attrs) {
        return txt ? "<" + tag + $h.attr(attrs) + ">" + txt + "</" + tag + ">" : "<" + tag + $h.attr(attrs) + " />";
    };
    $h.tagStart = function(tag, attrs) {
        return "<" + tag + $h.attr(attrs) + ">";
    };
    function fn1(tag) {
        return function(txt, attrs) {
            return $h.ele(tag, txt, attrs);
        }
    }
    function fn2(tag) {
        return function(attrs) {
            return $h.ele(tag, false, attrs);
        }
    }
    function fn3(tag, type) {
        return function(attrs) {
            attrs = attrs || {};
            attrs.type = type;
            return $h.ele(tag, false, attrs);
        }
    }
    function fn4(tag) {
        return function(attrs) {
            return $h.tagStart(tag, attrs);
        }
    }
    var tag, htmlElements = ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'li', 'b', 'div', 'option', 'select', 'thead',
        'label', 'span', 'em', 'table', 'tbody', 'th', 'tr', 'td', 'pre', 'code', 'option', 'i', 'a', 'nav', 'textarea', 'button', 'form', 'colgroup'];
    for (var i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn1(tag)
    }
    htmlElements = ['img', 'br', 'input', 'col'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn2(tag);
    }
    htmlElements = ['radio', 'checkbox', 'text', 'submit', 'hidden', 'reset', 'file', 'password'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag] = fn3('input', tag);
    }
    htmlElements = ['table'];
    for (i = 0, cnt = htmlElements.length; i < cnt; ++i) {
        tag = htmlElements[i];
        $h[tag + 'Start'] = fn4(tag);
        $h[tag + 'End'] = '</' + htmlElements[i] + '>';
    }
    $h.options = function (arr) {
        var h = '';
        for (var i = 0, cnt = arr.length; i < cnt; ++i) {
            h += $h.option(arr[i][0], {value: arr[i][1]});
        }
        return h;
    };
    $h.imgBase64Src = function (data, type) {
        if (!type) type = 'jpeg';
        return 'data:image/' + type + ';base64,' + data;
    };
    $h.imgBase64 = function (data, type) {
        if (!type) type = 'jpeg';
        return $h.img({src:'data:image/' + type + ';base64,' + data});
    };
    $h.spacer = function(attr) {
        var opt = {border:'0', src:'img/spacer.gif', height:'1px'};
        $.extend(opt, attr);
        return $h.img(opt);
    };
    $.extend(qwp, {
        _:'&nbsp',
        br:'<br>',
        jsvoid: 'javascript:void(0)',
        $: function(s, p) {
            if (qwp.isString(s)) {
                if (p) return p.find(s);
                else return $(s);
            }
            return s;
        },
        isString: function(v) {
            return $.type(v) == 'string';
        },
        isUndefined: function(v) {
            return $.type(v) == 'undefined';
        },
        toJson: function(d, v) {
            var j = false;
            if (v) j = v;
            if (d) {
                try { j = $.parseJSON(d); } catch (e) {}
            }
            return j;
        },
        convertLineBreak: function(t) {
            return t.replaceAll('\r\n', '\r').replaceAll('\r', '<br>').replaceAll('\n', '<br>');
        },
        in: function(v, arr) {
            if (!arr) return false;
            for (var i = 0, cnt = arr.length; i < cnt; ++i) {
                if (v == arr[i]) return true;
            }
            return false;
        },
        fn: function(f) {
            if ($.isFunction(f)) return f;
            if (qwp.isString(f)) return window[f];
            return false;
        },
        id: function(id) {
            return '#' + id;
        },
        cls: function(cls) {
            return '.' + cls;
        },
        to: function(url, isTopOrP, p) {
            if (!url) url = qwp.uri.curUrl;
            var isTop = false;
            if (isTopOrP === true) isTop = true;
            else if (isTopOrP) p = isTopOrP;
            if (p) {
                if (url.indexOf('?') == -1) url += '?';
                else url += '&';
                if (qwp.isString(p)) url += p;
                else url += $.param(p);
            }
            (isTop ? top : window).location = url;
        },
        reload: function() {
            window.location.reload();
        },
        once: function(f, timeout) {
            return setTimeout(f, timeout);
        },
        camelCase: function(s) {
            if (!s) return s;
            return s.substr(0, 1).toUpperCase() + s.substr(1);
        },
        isCorrectExt: function(fileName, exts) {
            fileName = fileName.toLowerCase();
            if (!$.isArray(exts)) exts = exts.split(',');
            for (var i = 0, cnt = exts.length; i < cnt; ++i) {
                if (fileName.endsWith('.' + exts[i])) {
                    return true;
                }
            }
            return false;
        },
        createOpsHandler: function(actionHandler, option) {
            var opt = {}, fn = $noop, formParams = null;
            if (actionHandler) {
                var ft = $.type(actionHandler);
                if (ft == 'string') {
                    fn = window[actionHandler];
                } else if (ft == 'function') {
                    fn = actionHandler;
                }
            }
            if (option.form) {
                formParams = $(option.form).data('qwp-params');
                delete option.form;
            }
            if (option) $.extend(opt, option);
            return function(res) {
                if (opt.confirmDialog) $('#' + opt.confirmDialog).data('clicked', false);
                if (res.ret && opt.formParentDialog) $('#' + opt.formParentDialog).modal('hide');
                var data = res.data || {}, timeout = res.ret ? 3 : 5;
                if (opt.noticeFadeOutTimeout) timeout = opt.noticeFadeOutTimeout;
                if (!res.ret && data.toLogin) {
                    qwp.notice(res.msg, {
                        timeout: timeout,
                        type: 'error',
                        image: 'img/loading_small.gif',
                        fn: function () {
                            qwp.to(data.toLogin, true);
                        }
                    });
                    return;
                }
                if (opt.quiet) {
                    fn(res, data, formParams);
                    if (res.ret && opt.reload) qwp.reload();
                    return;
                }
                if (res.ret && opt.reload) {
                    fn(res, data, formParams);
                    qwp.notice(res.msg + "<br />" + $L("Prepare to refresh page..."), {
                        timeout: timeout,
                        type: res.msg_type,
                        image: 'img/loading_small.gif',
                        fn: function () {qwp.reload();}
                    });
                    return;
                }
                fn(res, data, formParams);
                if (res.ret && (data.to || data.topTo)) {
                    qwp.notice(res.msg + "<br />" + $L("Prepare to relocation..."), {
                        timeout: timeout,
                        type: res.msg_type,
                        image: 'img/loading_small.gif',
                        fn: function () {
                            if (data.to) qwp.to(data.to);
                            else if (data.topTo) qwp.to(data.topTo, true);
                        }
                    });
                    return;
                }
                if (res.msg && res.msg.length > 0) {
                    qwp.notice(res.msg, {
                        timeout: timeout,
                        type: res.msg_type
                    });
                } else {
                    qwp.removeNotice();
                }
            }
        },
        ajax: function(options) {
            if (!options.quiet) {
                qwp.notice(options.text || $L('Operation is in processing, please wait...'),{
                    timeout:4,
                    image:'img/loading_small.gif'
                });
            }
            var fn = qwp.createOpsHandler(options.fn, options);
            $.ajax({
                url: options.url,
                data: options.params ? options.params : "",
                type: options.type,
                dataType: options.dataType || 'json',
                async:true,
                success: fn,
                timeout: options.timeout || 60000,
                error: function() {
                    fn({ret:false, msg: $L('Operation failed')});
                }
            });
        },
        post: function(options) {
            options.type = "POST";
            qwp.ajax(options);
        },
        get: function(options) {
            options.type = "GET";
            qwp.ajax(options);
        },
        copy: function(dst, src, attr) {
            if (!attr) {
                $.extend(dst, src);
                return;
            }
            if (qwp.isString(attr)) attr = [attr];
            for (var i = 0, cnt = attr.length; i < cnt; ++i) {
                var k = attr[i];
                if (src[k]) dst[k] = src[k];
            }
        },
        copyWhenEmpty: function(dst, src, attr) {
            if (qwp.isString(attr)) attr = [attr];
            for (var i = 0, cnt = attr.length; i < cnt; ++i) {
                var k = attr[i];
                if (!dst[k] && src[k]) dst[k] = src[k];
            }
        },
        isValidInput: function(v, ruleName) {
            if (!qwp.page.inputRules || !qwp.page.inputRules[ruleName]) return false;
            var re, r = qwp.page.inputRules[ruleName];
            if (qwp.isString(r)) {
                re = new RegExp(r);
                return re.test(v);
            } else if (qwp.isString(r[0])) {
                re = new RegExp(r[0], r[1]);
                return re.test(v);
            }
            var sub = r[0];
            for (var i = 0, cnt = sub.length; i < cnt; ++i) {
                if (r[1][i]) {
                    re = new RegExp(sub[i], r[1][i]);
                } else {
                    re = new RegExp(sub[i]);
                }
                if (!re.test(v)) {
                    return false;
                }
            }
            return true;
        },
        _lastNotice: false,
        //title, notice, timeout, type, position, image, callbacks, css
        notice: function(notice, opt) {
            var t = parseInt((new Date()).getTime() / 1000);
            if (qwp._lastNotice && qwp._lastNotice.txt == notice && (qwp._lastNotice.t + 3) > t) {
                qwp._lastNotice.t = t;
                return;
            }
            qwp.removeNotice();
            var option = {};
            if (qwp.isString(opt)) opt = {type: opt};
            if (opt) $.extend(option, opt);
            var title = option.title || $L("Operation notification");
            var timeout = option.timeout || ((option.type && (option.type == 'error' || option.type == 'warning')) ? 6 : 3);
            timeout *= 1000;
            if (option.fn) qwp.once(option.fn, timeout);
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                timeOut: timeout
            };
            var type = option.type || 'info';
            qwp._lastNotice = {id:toastr[type](notice, title), t:t, txt: notice};
            return qwp._lastNotice;
        },
        topNotice: function (notice, opt) {
            (parent ? parent.qwp : qwp).notice(notice, opt);
        },
        removeNotice: function() {
            if (qwp._lastNotice) {
                toastr.clear(qwp._lastNotice.id);
                qwp._lastGritter = false;
            }
        },
        parseProps: function(p) {
            var o = {};
            if (!p || p.length === 0) return o;
            p = p.split('|');
            for (var i = 0, cnt = p.length; i < cnt; ++i) {
                var a = p[i];
                var d = a.indexOf('=');
                if (d == -1) continue;
                o[a.substr(0, d)] = a.substr(d + 1);
            }
            return o;
        },
        sortData: function (option, data, sortf, sort, fn) {
            if (!sortf) sortf = option.sortf;
            if (!sortf) return;
            if (!sort) sort = option.sort;
            if (!sort) sort = 'desc';
            sort = sort == 'asc';
            data.data = data.data.sort($.isFunction(fn) ? fn : function (a, b) {
                if (sort) {
                    if (a[sortf] > b[sortf]) return 1;
                    else if (a[sortf] == b[sortf]) return 0;
                    return -1;
                }
                if (a[sortf] > b[sortf]) return -1;
                else if (a[sortf] == b[sortf]) return 0;
                return 1;
            });
        }
    });
    qwp.ui = {
        defaultIcon: 'glyphicon',
        input: {
            number: function(s, props, parent, params) {
                s = qwp.$(s, parent);
                s.unbind('blur').unbind('keypress');
                if (props.enter) s.unbind('keyup');
                if (props.disablePaste) s.unbind('paste').on('paste', $false);
                s.keypress(function(e){
                    if (e.keyCode < 48 || e.keyCode > 57) return false;
                });
                if (props.enter) {
                    s.keyup(function(e){
                        if (e.keyCode == 13) {
                            if (window[props.enter]) window[props.enter](e.delegateTarget, params);
                            else eval(props.enter);
                        }
                    });
                }
                s.blur(function(e){
                    var o = $(e.delegateTarget);
                    var isDefinedValue = typeof(props.defaultValue) !== 'undefined', v = o.val(), isValid;
                    if (v.length === 0) {
                        if (isDefinedValue) {
                            o.val(props.defaultValue);
                            o.trigger('change', e);
                        }
                        return;
                    }
                    isValid = /^\d+$/.test(v);
                    if (isValid && props.regExp) {
                        var re = new RegExp(props.regExp);
                        isValid = re.test(v);
                    }
                    if (!isValid) {
                        if (isDefinedValue) o.val(props.defaultValue);
                        else o.val('');
                        o.trigger('change', e);
                        return;
                    }
                    v = parseInt(v);
                    if (props.minValue) {
                        if (v < parseInt(props.minValue)) {
                            o.val(props.minValue);
                            o.trigger('change', e);
                            return;
                        }
                    }
                    if (props.maxValue) {
                        if (v > parseInt(props.maxValue)) {
                            o.val(props.maxValue);
                            o.trigger('change', e);
                        }
                    }
                });
                return s;
            },
            createUIComponents: function(p) {
                var t;
                if (p) t = p.find('input[qwp=number]');
                else t = $('input[qwp=number]');
                t.each(function(i, o){
                    o = $(o);
                    var props = qwp.parseProps(o.attr('props'));
                    qwp.ui.input.number(o, props, p);
                });
            }
        },
        icon: function(cls, full) {
            cls = qwp.ui.defaultIcon + '-' + cls;
            return full ? qwp.ui.defaultIcon + ' ' + cls : cls;
        },
        init: function() {
            qwp.ui._createFns();
        },
        _createFns: function() {
            if (qwp.ui._inited) return;
            qwp.ui._inited = true;
            var e4 = ['padding', 'margin'];
            for (var i = 0, cnt = e4.length; i < cnt; ++i) {
                qwp.ui._createFn4(e4[i]);
            }
            qwp.ui._createFn4('border', 'width');
        },
        _createFn4: function(n, suffix) {
            var inside = '';
            if (suffix) inside = '-' + suffix;
            qwp.ui[n] = function(o) {
                if (qwp.isString(o)) o = $(o);
                return {
                    left: parseInt(o.css(n + '-left' + inside)),
                    right: parseInt(o.css(n + '-right' + inside)),
                    top: parseInt(o.css(n + '-top' + inside)),
                    bottom: parseInt(o.css(n + '-bottom' + inside))
                };
            };
            qwp.ui['set' + qwp.camelCase(n)] = function(o, v) {
                if (qwp.isString(o)) o = $(o);
                o.css(n, v);
            };
            var e4 = ['left', 'right', 'top', 'bottom'];
            for (var i = 0, cnt = e4.length; i < cnt; ++i) {
                qwp.ui._createFn(n, e4[i], suffix);
            }
            qwp.ui._createFn2(n, e4[0], e4[1], suffix);
            qwp.ui._createFn2(n, e4[2], e4[3], suffix);
        },
        _createFn: function(n, side, suffix) {
            var inside = '';
            if (!suffix) suffix = '';
            else inside = '-' + suffix;
            var tmp = qwp.camelCase(side);
            qwp.ui[n + tmp + qwp.camelCase(suffix)] = function(o) {
                if (qwp.isString(o)) o = $(o);
                return parseInt(o.css(n + '-' + side + inside));
            };
            qwp.ui['set' + qwp.camelCase(n)  + tmp] = function(o, v) {
                if (qwp.isString(o)) o = $(o);
                o.css(n, v);
            };
        },
        _createFn2: function(n, side1, side2, suffix) {
            var inside = '';
            if (!suffix) suffix = '';
            else inside = '-' + suffix;
            var tmp = qwp.camelCase(side1) + qwp.camelCase(side2);
            qwp.ui[n + tmp + qwp.camelCase(suffix)] = function(o) {
                if (qwp.isString(o)) o = $(o);
                return parseInt(o.css(n + '-' + side1 + inside)) + parseInt(o.css(n + '-' + side2 + inside));
            };
        },
        _fns: [],
        push: function(f) {
            qwp.ui._fns.push(f);
        },
        createUIComponents: function(p) {
            qwp.ui.input.createUIComponents(p);
            var t;
            if (p) t = p.find('[data-rel=tooltip]');
            else t = $('[data-rel=tooltip]');
            t.each(function(i, o){
                e = $(o);
                if (!e.hasClass('tooltip-info')) e.addClass('tooltip-info');
                e.tooltip();
            });
            if (p) p.find('[data-rel=popover]').popover();
            else $('[data-rel=popover]').popover();
            for (var i = 0; i < qwp.ui._fns.length; ++i) {
                qwp.ui._fns[i](p);
            }
        },
        resize: function(f, timer, p, params) {
            if (!timer) {
                $(window).resize(f);
                return;
            }
            var inResize = false;
            var resize = function () {
                f(params);
                inResize = false;
            }, resizeTimer = function () {
                if (p) qwp.ui.whenVisible(p, resize);
                else resize();
            };
            $(window).resize(function () {
                if (inResize) return;
                inResize = true;
                setTimeout(resizeTimer, 200);
            });
            setTimeout(resizeTimer, 200);
        },
        autoHeight: function (s, delta) {
            var o = $(s), pos = o.offset();
            var h = $(window).height() - pos.top - qwp.ui.paddingTopBottom(o) - qwp.ui.borderTopBottomWidth(o) - qwp.ui.marginBottom(o);
            if (delta) {
                if ($.isNumeric(delta)) delta = parseInt(delta);
                else delta = qwp.fn(delta)();
            } else {
                delta = 0;
            }
            h -= delta;
            o.css({height:h+'px'});
        },
        e: function(s) {
            s = $(s);
            return s && s.length > 0 ? s[0] : !!0;
        },
        tmpl: function(id, noRemove) {
            var o = $("qwp[tmpl='" + id + "']");
            var h = o.html();
            if (!noRemove) o.remove();
            return h;
        },
        toggleClass: function(o, cls1, cls2) {
            if (qwp.isString(o)) o = $(o);
            if (o.hasClass(cls1)) {
                o.removeClass(cls1);
                o.addClass(cls2);
            } else {
                o.removeClass(cls2);
                o.addClass(cls1);
            }
        },
        addTooltip: function(attr) {
            if (!attr) attr = {};
            var tip = {
                'data-rel': 'tooltip',
                'data-placement': 'bottom'
            };
            $.extend(tip, attr);
            if (!tip['data-original-title'] && tip['title']) {
                tip['data-original-title'] = tip['title'];
                delete tip['title'];
            }
            return tip;
        },
        frame: function(name) {
            return document.all ? window.frames[name] : $("#"+name)[0].contentWindow;
        },
        loadingFrame: function(frameId, page, reloadWhenSrcIsSame) {
            var frame = $("#"+frameId);
            if (frame.length == 0) return;
            var ifm = qwp.isString(frameId) ? qwp.ui.frame(frameId) : frameId;
            var oldPage = frame.attr("src");
            if (qwp.isEmpty(oldPage) && qwp.isEmpty(page)){
                return;
            }
            if (qwp.isEmpty(page)) {
                page = frame.attr("src");
            }
            if (!reloadWhenSrcIsSame && !qwp.isEmpty(oldPage) && oldPage == page){
                return;
            }
            var imgUrl = top.qwp.loadingImg.src;
            frame.attr("src", "about:blank");
            if (ifm.window && ifm.window.document && ifm.window.document.body) {
                ifm.window.document.body.style.backgroundColor = "white";
                ifm.window.document.body.style.fontSize = "12px";
                ifm.window.document.body.innerHTML = "&nbsp;<br>" + $h.div($h.img({border:'0', src:imgUrl}) +
                "<br>" + $L("Loading page..."), {align:'center'});
            }
            frame.attr("src", page);
        },
        overlay: function(show, txt, parent, transparent, notShowLoading, top) {
            var p = $(parent ? parent : 'body'), zIndex = parent ? '1' : '999999', id = qwp.ui._ols.length + 1;
            qwp.ui._ols.push(id);
            if (p.find('> div[qwp=overlay]').length === 0) {
                var bk = transparent ? 'rgba(255, 255, 255, 0.7)' : 'white';
                p.append('<div id="overlay-'+id+'" qwp="overlay" style="margin:0;padding:0;text-align: center;display:none;z-index: '+zIndex+';position: absolute;background-color: '+bk+';">{0}<span mtag="txt"></span></b></div>'.format(notShowLoading ? '' : '<img src="img/loading_small.gif"><br>'));
            }
            var o = p.find('> div[qwp=overlay]');
            if (txt) o.find('> span[mtag=txt]').html(txt);
            o.css({left: '0', top: top ? top : '0'});
            if (show) {
                qwp.ui.sameSize(o, p);
                o.show();
            } else {
                o.hide();
            }
        },
        sameSize: function(o, p) {
            var padding = qwp.ui.padding(p), border = qwp.ui.border(p), margin = qwp.ui.margin(p);
            var w = p.width() + padding.left + padding.right + border.left + border.right + margin.left + margin.right;
            var h = p.height() + padding.top + padding.bottom + border.top + border.bottom + margin.top + margin.bottom;
            o.width(w).height(h);
        },
        _ols: [],
        _timer: function() {
            for (var i = 0, cnt = qwp.ui._ols.length; i < cnt; ++i) {
                if (!qwp.ui._ols[i]) continue;
                var o = $('#overlay-' + qwp.ui._ols[i] + ':visible');
                if (o.length > 0) qwp.ui.sameSize(o, o.parent());
            }
        },
        whenVisible: function(p, f, params) {
            if ($(p).is(':visible')) {
                f(params);
                return false;
            }
            return setTimeout(function () {
                qwp.ui.whenVisible(p, f, params);
            }, 200);
        }
    };
    qwp.uri = {
        root: './',
        blank: 'about:blank',
        currentPage: function(p, params) {
            return qwp.uri.page(p ? p : qwp.page.p, params);
        },
        currentOps: function(ops, params) {
            return qwp.uri.ops(ops, qwp.page.p, params);
        },
        currentHome: function(params) {
            return qwp.uri.module(qwp.page.m, params);
        },
        defaultModule: function(params) {
            return qwp.uri.module(qwp.page.m, params);
        },
        createUrlWithoutSortParams: function(params, mp) {
            var p = false;
            if (params) p = qwp.isString(params) ? params : $.param(params);
            if (!p) return qwp.uri.curUrlNoSort;
            var u = qwp.uri.curUrlNoSort;
            if (qwp.isString(mp)) {
                if (mp.length === 0) u = u.replace(/p=(\w+)/, '');
                else u = u.replace(/p=(\w+)/, 'p='+mp);
            }
            return u + (qwp.uri.curUrlNoSortHasParams ? '&' : '') + p;
        },
        join: function() {
            var p = '', sep = '';
            for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
                if (arguments[i].length) {
                    p += sep + arguments[i];
                    sep = '&';
                }
            }
            return p;
        },
        module: function(m, params) {
            var p = '';
            if (m) p = 'm=' + m;
            if (params) {
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                p = qwp.uri.join(p, params);
            }
            if (p.length) return qwp.uri.root + '?' + p;
            return qwp.uri.root;
        },
        page: function(p, params, m) {
            if (!m) {
                m = qwp.page.m;
            }
            var s = '';
            if (m) s = 'm=' + m;
            if (p) s = qwp.uri.join(s, 'p=' + p);
            if (params) {
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                s = qwp.uri.join(s, params);
            }
            if (s.length) return qwp.uri.root + '?' + s;
            return qwp.uri.root;
        },
        ops: function(ops, p, params, m) {
            if (!m) {
                m = qwp.page.m;
            }
            var s = '';
            if (m) s = 'm=' + m;
            if (p) s = qwp.uri.join(s, 'p=' + p);
            s = qwp.uri.join(s, 'op=' + ops);
            if (params) {
                if (!qwp.isString(params)) {
                    params = $.param(params);
                }
                s = qwp.uri.join(s, params);
            }
            if (s.length) return qwp.uri.root + '?' + s;
            return qwp.uri.root;
        },
        logout: function() {
            return qwp.uri.ops('logout', false, false, 'passport');
        },
        createPagerParams: function(page, psize, sortf, sort) {
            var p = {};
            if (page) p.page = page;
            if (psize) p.psize = psize;
            if (sortf) p.sortf = sortf;
            if (sort) p.sort = sort;
            return p;
        },
        clearSortParams: function(url) {
            return url.replace(/&sortf=[\w-]+/ig, '').
                replace(/&sort=[\w-]+/ig, '').
                replace(/&sort=[\w-]+/ig, '').
                replace(/&sort=[\w-]+/ig, '');
        },
        init: function() {
            var tmp = location.search ? location.search.replace(/(&s\[.+\]=[%|\w|\+\-\.\+]+)|(&s%5b.+%5d=[%|\w|\+\-\.\+]+)/i, '').replace(/(&s\[.+\]=)|(&s%5b.+%5d=)/i, '') : '';
            var base = './';
            qwp.uri.baseUrl = base + (tmp ? tmp : '?');
            qwp.uri.baseUrlHasParams = tmp && tmp.indexOf('=') != -1;
            qwp.uri.curUrl = (location.search ? './' + location.search : qwp.uri.baseUrl);
            tmp = qwp.uri.clearSortParams(qwp.uri.curUrl);
            qwp.uri.curUrlNoSort = tmp;
            qwp.uri.curUrlNoSortHasParams = tmp && tmp.indexOf('=') != -1;
            qwp.uri.hasParams = location.search ? true : false;
        }
    };
})(jQuery, $h);
function $READY() {
    qwp.uri.init();
    qwp.ui.init();
    $.each(['table', 'dialog', 'form', 'search', 'list'], function(i, v){
        if (qwp[v]) qwp[v].init();
    });
    if ($.isFunction(window['initPage'])) qwp.r(initPage);
    for (var i = 0; i < qwp._r.length; ++i) {
        qwp._r[i]();
    }
    qwp.ui.createUIComponents();
    setInterval(function(){qwp.ui._timer();}, 300);
}
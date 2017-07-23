qwp.im = {
    create: function(container, name, option) {
        qwp.im._init();
        var o = $(container);
        option = option || {};
        option.container = container;
        if (option.autoResize !== false) option.autoResize = true;
        if (!option.did) option.did = 'id';
        o.append(qwp.im._tmpl.format(name, option.allowSending ? 'block' : 'none'));
        qwp.ui.createUIComponents(o);
        $(qwp.im._b(name)).data('option', option);
        qwp.im.update(name, option.data);
        qwp.im._customize(name, option);
        if (option.autoResize) qwp.im._createResize(name);
    },
    load: function(name, notes, page, psize, sortf, sort, op, params) {
        var option = qwp.im.opt(name);
        if (!notes) notes = option.notes;
        if (!page) page = option.page;
        if (!psize) psize = option.psize;
        if (!sortf) sortf = option.sortf;
        if (!sort) sort = option.sort;
        if (!op) op = option.list_op;
        if (!op) op = 'list_messages';
        var p = qwp.im._formData(name, option);
        if (option.lastId) {
            if (p) p += '&';
            p += 'last=' + option.lastId;
        }
        if (params) {
            if (p) p += '&';
            if (!qwp.isString(params)) params = $.param(params);
            params = p + params;
        } else {
            params = p;
        }
        if (option.params) {
            if (!params) params = {};
            if (qwp.isString(params)) params += '&' + $.param(option.params);
            else $.extend(params, option.params);
        }
        qwp.im._loading(name, notes.text);
        qwp.get({
            url:qwp.im._createOpsURI(name, op, page, psize, sortf, sort, params),
            quiet: true,
            fn:function(res, data) {
                if (res.ret) {
                    qwp.im.update(name, data, page, psize, sortf, sort);
                } else {
                    qwp.notice(res.msg ? res.msg : (notes.list_failed ? notes.list_failed : $L('Failed to load message data')));
                    qwp.im._stopLoading(name)
                }
            }
        });
    },
    send: function (name, msg, params) {
        var option = qwp.im.opt(name), notes = option.notes;
        if (!params) params = option.params;
        if (!msg) msg = $(qwp.im._t(name)).val();
        if (!msg) {
            qwp.notice($L('Message is empty'), 'warning');
            return;
        }
        var time = (new Date()).toLocalTime('yyyy-MM-dd hh:mm:ss');
        qwp.post({
            url:qwp.im._createOpsURI(name, option.send_op ? option.send_op : 'send_message', false, false, false, false, params),
            quiet: true,
            params:{msg: msg, sender: option.user.id, peer: option.peer.id, time: time},
            fn:function(res) {
                var opt = qwp.im.opt(name);
                if (res.ret) {
                    qwp.im.addItems(name, [$.extend({msg: msg, time: time}, opt.user)]);
                    $(qwp.im._t(name)).val('');
                } else {
                    qwp.notice(res.msg ? res.msg : (notes.send_failed ? notes.send_failed : $L('Failed to send message')));
                    qwp.im._stopLoading(name);
                }
            }
        });
    },
    params: function(name, v) {
        var option = qwp.im.opt(name);
        if (v) option.params = v;
        return option.params;
    },
    opt: function(name) {
        return qwp.isString(name) ? $(qwp.im._b(name)).data('option') : name.data('option');
    },
    update: function(name, data, page, psize, sortf, sort) {
        qwp.im._stopLoading(name);
        var container = qwp.im._b(name);
        var option = $(container).data('option');
        if (data && data.page) {
            option.page = parseInt(data.page);
        } else if (page) {
            option.page = page;
        } else if (!option.page) {
            if (qwp.page && qwp.page.page) option.page = qwp.page.page;
            else option.page = 1;
        }
        if (data && data.psize) {
            option.psize = parseInt(data.psize);
        } else if (psize) {
            option.psize = psize;
        } else if (!option.psize) {
            if (qwp.page && qwp.page.psize) option.psize = qwp.page.psize;
            else option.psize = 30;
        }
        if (sortf) option.sortf = sortf;
        if (sort) option.sort = sort;
        else option.sort = 'desc';
        if (!data) data = {total:0};
        if (data.total) {
            option.total = Math.ceil(data.total / option.psize);
            option.totalRecords = data.total;
            if (option.localSort) qwp.sortData(option, data, sortf, sort);
            qwp.im.addItems(name, data.data, true);
        } else {

        }
    },
    addItems: function(name, data, prepend) {
        if (!data) return;
        var d = $.isArray(data) ? data : [data], h = '';
        if (d.length === 0) return;
        var container = qwp.im._b(name);
        var option = $(container).data('option'), dataConvertor = false;
        if (option.dataConvertor) dataConvertor = qwp.fn(option.dataConvertor);
        var hasLastId = !qwp.isUndefined(option.lastId);
        for (var i = 0, cnt = d.length; i < cnt; ++i) {
            var r = d[i];
            if (dataConvertor) dataConvertor(r);
            h += qwp.im._getChatHtml(name, option, r, option.user.name === r.name);
            if (!hasLastId || option.lastId < r[option.did]) {
                option.lastId = r[option.did];
                hasLastId = true;
            }
        }
        var l = $(container);
        if (prepend) l.prepend(h);
        else l.append(h);
        for (i = 0, cnt = d.length; i < cnt; ++i) {
            $(container + qwp.im._item(name, d[i], option)).data('r', d[i]);
        }
        qwp.ui.createUIComponents(l);
        if (option.createUIComponents) qwp.fn(option.createUIComponents)(l);
    },
    setUser: function (user, peer) {
        var opt = qwp.im.opt(name);
        opt.user = user;
        if (peer) opt.peer = peer;
    },
    item: function (name, id) {
        var container = qwp.im._b(name);
        return $(container + qwp.im._item(id), $(container).data('option')).data('r');
    },
    updateSize: function(name) {
        var o = $(qwp.im._b(name)), option = o.data('option'), hDelta = 0;
        var pos = o.offset(), c = $(option.container);
        var h = $(window).height() - pos.top - qwp.ui.paddingTopBottom(c) - qwp.ui.borderTopBottomWidth(c) - qwp.ui.marginBottom(o) - 8;
        if (option.heightDelta) {
            if ($.isNumeric(option.heightDelta)) hDelta += parseInt(option.heightDelta);
            else hDelta += qwp.fn(option.heightDelta)();
        }
        var s = $(qwp.im._s(name));
        h -= hDelta + (option.allowSending ? (s.height() + qwp.ui.paddingTopBottom(s) + qwp.ui.borderTopBottomWidth(s)): 0);
        $(qwp.im._b(name)).css({height:h+'px',width:'100%'}).slimscroll({height: h+'px',width: '100%'});
    },
    _stopLoading: function(name) {
        qwp.ui.overlay(false, false, qwp.list._b(name));
    },
    _b: function(name) {
        return '#qwp-im-' + name;
    },
    _s: function (name) {
        return '#qwp-send-' + name;
    },
    _t: function (name) {
        return '#qwp-send-' + name + ' textarea[mtag=send-msg]';
    },
    _btn: function (name) {
        return '#qwp-send-' + name + ' button[mtag=send-msg]';
    },
    _item: function (name, data, option) {
        var id;
        if (qwp.isString(data) || $.isNumeric(data)) id = data;
        else id = data[option.did];
        return ' div[mtag=msg_item][rid=' + qwp.im._item_prefix(name) + id + ']';
    },
    _loader: function (name, txt) {

    },
    _item_prefix: function (name) {
        return 'msg-' + name + '-';
    },
    _formData: function (name) {
        return '';
    },
    _getTmpl: function() {
        return '<div class="chat-messages-loader"></div><div class="direct-chat-messages" id="qwp-im-{0}"></div>' +
            '<div id="qwp-send-{0}" class="qwp-send-message" style="display: {1}"><textarea placeholder="'+$L('Input message...')+'" type="text" mtag="send-msg"></textarea><button mtag="send-msg" class="btn btn-primary btn-lg">' + $L('Send') +'</button></div>';
    },
    _getChatHtml: function (name, option, data, right) {
        var o = {};
        o.name = data.url ? $h.a(data.name, {href: data.url}) : data.name;
        o.time = data.time;
        o.avatar_url = '#';
        if (data.avatar) {
            if (data.avatar.base64) {
                o.avatar = $h.imgBase64Src(data.avatar.src, data.avatar.type);
            } else {
                o.avatar = (data.avatar.prefix ? data.avatar.prefix : 'img') + '/' + data.avatar.src;
            }
            if (data.avatar.url) o.avatar_url = data.avatar.url;
        } else {
            o.avatar = 'img/avatar.png';
        }
        o.msg = data.msg;
        var p1, p2, p3;
        if (right) {
            o.p3 = ' right';
            o.p1 = 'right';
            o.p2 = 'left';
        } else {
            o.p3 = '';
            o.p1 = 'left';
            o.p2 = 'right';
        }
        o.im_name = qwp.im._item_prefix(name);
        o.id = data[option.did];
        return ('<div class="direct-chat-msg{p3}" mtag="msg" rid="{im_name}{id}">'+
            '<div class="direct-chat-info clearfix">'+
            '<span class="direct-chat-name pull-{p1}">{name}</span>'+
            '<span class="direct-chat-timestamp pull-{p2}">{time}</span></div>'+
            '<a href="{avatar_url}"><img class="direct-chat-img" src="{avatar}"></a>'+
            '<div class="direct-chat-text">{msg}</div>'+
            '</div>').format(o);
    },
    _createOpsURI: function(name, ops, page, psize, sortf, sort, params) {
        var p = qwp.uri.createPagerParams(page, psize, sortf, sort);
        var option = qwp.im.opt(name);
        qwp.copyWhenEmpty(p, option, ['page', 'psize', 'sortf', 'sort']);
        var mp = false;
        if (qwp.isString(ops)) {
            p.op = ops;
        } else {
            mp = ops[1];
            p.op = ops[0];
        }
        if (params && qwp.isString(params)) {
            p = $.param(p);
            p += '&' + params;
        } else if (params) {
            $.extend(p, params);
        }
        if (option.params) {
            if (qwp.isString(p)) p += '&' + $.param(option.params);
            else $.extend(p, option.params);
        }
        return qwp.uri.createUrlWithoutSortParams(p, mp);
    },
    _createResize: function(name) {
        qwp.ui.resize(function(){
            qwp.im.updateSize(name);
        }, true, qwp.im._b(name));
    },
    _customize: function(name, option) {
        if (option.allowSending) {
            $(qwp.im._btn(name)).click(function () {
                qwp.im.send(name);
            });
        }
    },
    _init: function() {
        if (!qwp.im._tmpl) qwp.im._tmpl = qwp.im._getTmpl();
    }
};
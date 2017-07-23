/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.dialog = {
    init: function() {
        if (!qwp.dialog.tmpl) {
            qwp.dialog.tmpl = qwp.ui.tmpl('dialog_base');
        }
        qwp.dialog.create('qwp_mbox', {
            content : '&nbsp',
            width : 380,
            height : 100,
            'z-index' : '99999998'
        });
        if (qwp.components && qwp.components.dialogs) {
            var dialogs = qwp.components.dialogs;
            for (var id in dialogs) {
                qwp.dialog.create(id, dialogs[id]);
            }
        }
    },
    showMsgBox: function(opt) {
        if (!opt) opt = {};
        qwp.dialog.show('qwp_mbox', opt);
    },
    create: function(id, opt) {
        opt.id = id;
        if (qwp.isString(opt.url)) {
            if (!opt.url.length) opt.url = qwp.uri.blank;
            var scroll = '';
            if (opt.noScroll) scroll = ' scrolling="no"';
            opt.content = '<iframe qwp="frame"{2} id="{1}_frame" name="{1}_frame" frameborder="0" width="100%" height="100%" src="{0}"></iframe>'.format(opt.url, id, scroll)
        } else if (opt.tmpl) {
            opt.content = qwp.ui.tmpl(id);
        }
        if (!opt['z-index']) opt['z-index'] = '99999997';
        if (!opt['margin-top']) opt['margin-top'] = '3px';
        if (!opt.title) opt.title = '';
        $('body').append(qwp.dialog.tmpl.format(opt));
        $('#' + id).data('opt', opt);
        qwp.dialog.customize(id, opt);
        qwp.dialog._updateDialogSize(id, opt);
        qwp.dialog._createResize(id, opt);
    },
    frame: function(id, attr) {
        if (attr) $('#' + id + '_frame').attr(attr);
        else return qwp.ui.frame(id + '_frame');
    },
    show: function(id, opt) {
        if (opt) {
            qwp.dialog.customize(id, opt);
        }
        qwp.removeNotice();
        $('#' + id).modal();
        qwp.dialog._updateDialogSize(id, opt);
    },
    confirmForm: function (dialogId, btn, fnAction) {
        var id = "#" + dialogId;
        var f = $(id + " [qwp='ok']");
        f.unbind("click");
        var cAction = fnAction || false;
        f.click(function () {
            if (cAction) {
                if (cAction() !== false) $(btn[2]).click();
                return;
            }
            $(id).data('clicked', true);
            if (qwp.isString(btn)) $(btn).click();
            else $(btn[1]).submit();
        });
    },
    customizeMsgBox: function(opt) {
        qwp.dialog.customize('qwp_mbox', opt);
    },
    title: function(id, title) {
        $('#' + id + " [qwp='title']").html(title);
    },
    titleImage: function(id, img) {
        $('#' + id + " [qwp='img']").html($h.img({src:img}));
    },
    bottomLeftHtml: function(id, html, append) {
        if (append) $('#' + id + " [qwp=btns-left]").append(html);
        else $('#' + id + " [qwp=btns-left]").html(html);
    },
    customize: function(dialogId, opt) {
        var id = "#" + dialogId;
        if (!opt) opt = $(id).data('opt');
        if (opt.noBtns) {
            $(id + ' .modal-footer').hide();
        } else {
            var obj = $(id + " [qwp='ok']");
            obj.unbind("click");
            if (opt.noOk) {
                obj.hide();
            } else {
                var t = $(id + " [qwp='txt-ok']").text();
                if (!t || opt.txtOk) {
                    $(id + " [qwp='txt-ok']").text(opt.txtOk ? $L(opt.txtOk) : $L('Ok'));
                }
                if (opt.ok) {
                    if (opt.inFrame) {
                        obj.click(function() {
                            if (qwp.ui.frame(dialogId + '_frame')[opt.ok]() === false) return false;
                        });
                    } else {
                        obj.click(qwp.fn(opt.ok));
                    }
                }
            }
            obj = $(id + " [qwp='cancel']");
            obj.unbind("click");
            if (opt.noCancel) {
                obj.hide();
            } else {
                var t = $(id + " [qwp='txt-cancel']").text();
                if (!t || opt.txtCancel) {
                    $(id + " [qwp='txt-cancel']").text(opt.txtCancel ? $L(opt.txtCancel) : $L('Cancel'));
                }
                if (opt.cancel) obj.click(qwp.fn(opt.cancel));
            }
        }
        if (opt.title) qwp.dialog.title(dialogId, opt.title);
        if (opt.img) qwp.dialog.titleImage(dialogId, opt.img);
        if (opt.message) {
            $(id + " .modal-body").html(opt.message);
        }
        if (opt.url && opt.url != qwp.uri.blank) {
            qwp.ui.loadingFrame(dialogId + "_frame", opt.url);
        } else if (opt.reload) {
            qwp.dialog.frame(dialogId).location.reload();
        }
    },
    _updateDialogSize: function(did, opt) {
        var id = qwp.id(did);
        var deltY = 78;
        if (!opt) opt = $(id).data('opt');
        if (opt.max) {
            opt.height = $(window).height() - deltY;
            if (!opt.noBtns) {
                opt.height -= 66;
            }
            opt.width = $(window).width() - 20;
            $(id + " .modal-dialog").css("padding-top", '8px');
        } else if (opt.maxHeight) {
            opt.height = $(window).height() - deltY;
            if (!opt.noBtns) {
                opt.height -= 66;
            }
            $(id + " .modal-dialog").css("padding-top", '8px');
        }
        if (!opt.height) {
            opt.height = $(id + " .modal-body").data('height');
            if (!opt.height) opt.height = 100;
        }
        if (opt.height) {
            $(id + " .modal-body").css("height", parseInt(opt.height) + "px");
            $(id + " .modal-body").data('height', opt.height);
        }
        if (opt.width) {
            $(id + " .modal-content").css("width", parseInt(opt.width) + "px");
            $(id + " .modal-dialog").css("width", opt.width + "px");
        }
        if ($(id + " iframe[qwp='frame']").length === 0) {
            qwp.ui.setPaddingLeft(id, '0');
            var content = $(id + " .modal-body");
            content.slimscroll({height: content.height() + 'px'});
        }
        qwp.dialog._fnResize[did] = false;
    },
    _createResize: function(id, opt) {
        var resize = function() {
            if ($('#' + id).is(':hidden')) {
                setTimeout(resize, 200);
                return;
            }
            qwp.dialog._updateDialogSize(id, opt);
        };
        qwp.ui.resize(resize);
        qwp.dialog._fnResize[id] = function() {
            if (!qwp.dialog._resizeTimer[id]) {
                qwp.dialog._resizeTimer[id] = setTimeout(resize, 200);
            }
        };
        qwp.ui.resize(qwp.dialog._fnResize[id]);
    },
    _fnResize:{},
    _resizeTimer:{}
};
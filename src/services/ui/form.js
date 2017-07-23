/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
qwp.form = {
    init: function() {
        qwp.form._createValidators();
        qwp.form.fillAllForms();
        if (qwp.page && qwp.page.validator) {
            for (var f in qwp.page.validator) {
                qwp.form.setFormValidation(f, qwp.page.validator[f]);
            }
        }
    },
    fillAllForms: function(forms) {
        if (!forms && qwp.page) forms = qwp.page.forms || false;
        if (!forms) return;
        for (var f in forms) {
            qwp.form.fill(f, forms[f]);
        }
    },
    fill: function(f, values, needValid) {
        for (var n in values) {
            var fields = $(f + " input[name='f[" + n + "]']");
            if (fields.length > 0) {
                fields.val(values[n]);
                continue;
            }
            fields = $(f + " textarea[name='f[" + n + "]']");
            if (fields.length > 0) {
                fields.val(values[n]);
                continue;
            }
            fields = $(f + " select[name='f[" + n + "]']");
            if (fields.length > 0) {
                fields.val(values[n]);
            }
        }
        if (needValid) $(f).valid();
    },
    reset: function(f) {
        qwp.ui.e(f).reset();
    },
    action: function(f, ops, p) {
        if (!p) p = {};
        if (p.reset) qwp.form.reset(f);
        if (p.msgBox) qwp.dialog.customizeMsgBox(p.msgBox);
        if (p.dialog) {
            var opt = {}, dialog;
            if (qwp.isString(p.dialog)) {
                dialog = p.dialog;
            } else {
                dialog = p.dialog[0];
                if (qwp.isString(p.dialog[1])) opt.title = p.dialog[1];
                else $.extend(opt, p.dialog[1]);
            }
            qwp.dialog.show(dialog, opt);
        }
        var action = null;
        if (qwp.isString(ops)) {
            p.ops = ops;
            $(f).data('qwp-params', p).attr('action', qwp.uri.currentOps(ops, p.params));
        } else if ($.isFunction(ops)) {
            p.ops = qwp.$fn(ops);
            p.fn = ops;
            $(f).data('qwp-params', p);
            action = ops;
        }
        qwp.form.resetDialogSubmit(f, action);
    },
    submit: function(f) {

    },
    resetDialogSubmit: function(formSelector, fnAction) {
        if (!qwp.page || !qwp.page.validator || !qwp.page.validator[formSelector]) return;
        var v = qwp.page.validator[formSelector];
        if (!v.noSubmit) qwp.form._attachActionHandler(formSelector, v);
        qwp.form._attachConfirm(formSelector, v, fnAction);
    },
    setFormValidation: function(formSelector, v) {
        if (!qwp.page) qwp.page = {};
        if (!qwp.page.validator) {
            qwp.page.validator = {};
            qwp.page.validator[formSelector] = v;
        }
        var rules = {}, messages = {};
        for (var r in v.rules) {
            var item = {}, fieldName = 'f[' + r + ']', added = false;
            for (var k in v.rules[r]) {
                if (k == '_avoidSqlInj') continue;
                var rv = v.rules[r][k];
                if (k == '_msg') {
                    messages[fieldName] = rv;
                } else if (k != 'optional') {
                    added = true;
                    item[k] = (k == '=' || k == 'equalTo') ? rv[0] : rv;
                }
            }
            if (added) rules[fieldName] = item;
        }
        if (v.formParentDialog) {
            v.submitButton = ['#' + v.formParentDialog + " button[qwp='ok']", formSelector, '#' + v.formParentDialog + " button[qwp='cancel']"];
        }
        var files = false;
        if (v.files) {
            files = {form: formSelector, items:{}};
            for (var fr in v.files) {
                files.items[fr] = {required: v.rules[fr]['required'] ? true : false, rule : false};
                if ($.isArray(v.files[fr])) {
                    files.items[fr].rule = v.files[fr];
                    if (files.items[fr].rule[0]) files.items[fr].rule[0] = files.items[fr].rule[0].split(',');
                }
            }
        }
        var opt = {
            errorElement: 'div',
            errorClass: 'help-inline',
            rules: rules,
            messages: messages
        };
        var aF = $(formSelector);
        if (v.submitButton) {
            if (v.submitHandler) {
                if (qwp.isString(v.submitHandler)) v.submitHandler = window[v.submitHandler];
                var opParam = {
                    ops: qwp.$fn(v.submitHandler),
                    fn: v.submitHandler    
                };
                aF.data('qwp-params', opParam);
            }
            opt.submitHandler = qwp.form._createSubmitHandler(v.beforeSubmit, v.actionMessage, v.confirmDialog, v.mbox, v.submitButton, files);
        } else {
            var optSubmitHandler = false;
            if (v.submitHandler) optSubmitHandler = (qwp.isString(v.submitHandler)) ? window[v.submitHandler] : v.submitHandler;
            opt.submitHandler = function(v, f, e) {
                var params = $(v).data('qwp-params');
                if (params && params.fn) {
                    params.fn();
                    return false;
                } else if (optSubmitHandler) {
                    optSubmitHandler();
                    return false;
                }
                return true;
            };
        }
        if (v.invalidHandler) opt.invalidHandler = window[v.invalidHandler];
        if(v.enableFocusout) opt.onfocusout = function(element){
            this.element(element);
        }
        if (v.successClass){
            opt.success = v.successClass;
        }
        var validator = aF.validate(opt);
        if(v.cacheValidator) qwp.form._cachedFormValidators[formSelector] = validator;
        if (!v.noSubmit) qwp.form._attachActionHandler(formSelector, v);
        qwp.form._attachConfirm(formSelector, v);
    },
    getValidator: function (formSelector) {
        return qwp.form._cachedFormValidators[formSelector];
    },
    _checkFile: function(opt, item) {
        var v = item.val();
        if (opt.required && v.length === 0) return false;
        if ((!opt.required && v.length === 0) || !opt.rule) return true;
        return !opt.rule[0] || qwp.isCorrectExt(v, opt.rule[0]);
    },
    _checkFiles: function(opts) {
        for (var n in opts.items) {
            var opt = opts.items[n];
            var o = $(opts.form + " input[type='file'][name='f[{0}]']".format(n));
            var i, cnt, f;
            for (i = 0, cnt = o.length; i < cnt; ++i) {
                f = $(o[i]);
                if (!qwp.form._checkFile(opt, f)) {
                    f.focus();
                    qwp.notice($L('Please select correct files to upload!'));
                    return false;
                }
            }
            if (o.length) continue;
            o = $(opts.form + " input[type='file'][name='f[{0}][]']".format(n));
            for (i = 0, cnt = o.length; i < cnt; ++i) {
                f = $(o[i]);
                if (!qwp.form._checkFile(opt, f)) {
                    f.focus();
                    qwp.notice($L('Please select correct files to upload!'));
                    return false;
                }
            }
            if (!o.length) {
                qwp.notice($L('Please select correct files to upload!'));
                return false;
            }
        }
        return true;
    },
    _createSubmitHandler: function(submitHandler, message, confirmDialog, mbox, submitButton, files) {
        var fn = submitHandler ? window[submitHandler] : function(){return true};
        return function(v, f, e) {
            if (fn(v, f, e) === false) return false;
            if (files && qwp.form._checkFiles(files) === false) return false;
            var dialogId = '#' + confirmDialog;
            if (!confirmDialog || $(dialogId).data('clicked')) {
                qwp.notice(message);
                return true;
            }
            if (confirmDialog == 'qwp_mbox') {
                var params = {fn:false};
                if (mbox) {
                    var opt = mbox;
                    var tmpParam = $(v).data('qwp-params');
                    if (tmpParam) params = tmpParam;
                    if ($.isFunction(mbox)) {
                        opt = mbox(params);
                    } else if (qwp.isString(mbox)) {
                        opt = window[mbox](params);
                    }
                    qwp.dialog.showMsgBox(opt);
                }
                qwp.dialog.confirmForm('qwp_mbox', submitButton, params.fn);
            } else {
                $(dialogId).modal();
            }
            return false;
        }
    },
    _attachConfirm: function(formSelector, v, fnAction) {
        if (v.submitButton) {
            var okBtn;
            if (qwp.isString(v.submitButton)) okBtn = $(v.submitButton);
            else okBtn = $(v.submitButton[0]);
            okBtn.unbind('click');
            okBtn.click(function() {
                $(formSelector).submit();
                return false;
            });
        }
        if (v.confirmDialog) {
            qwp.dialog.confirmForm(v.confirmDialog, v.submitButton, fnAction);
        }
    },
    _attachActionHandler: function(formSelector, v) {
        if (!v.actionHandler) return;
        var opt = {form: formSelector};
        if (v.handlerOption) $.extend(opt, v.handlerOption);
        qwp.copy(opt, v, ['confirmDialog', 'formParentDialog']);
        var fnHandler = qwp.createOpsHandler(v.actionHandler, opt);
        opt = {
            error: function() {fnHandler({ret:false, msg: $L('Operation failed')});},
            success: fnHandler
        };
        opt.dataType = v.dataType ? v.dataType : 'json';
        $(formSelector).ajaxForm(opt);
    },
    _createOneValidator: function(n) {
        if ($.validator.methods[n]) return;
        $.validator.addMethod(n, function (value, element) {
            return (this.optional(element) && !value) || (qwp.isValidInput(value, n));
        }, qwp.form.getDefaultInvalidInputText(n));
    },
    _createValidators: function() {
        var $ = jQuery;
        if (!qwp.page || !qwp.page.inputRules) return;
        var rules = qwp.page.inputRules;
        for (var n in rules) {
            qwp.form._createOneValidator(n, rules[n]);
        }
        $.validator.methods['='] = $.validator.methods['equalTo'];
        $.validator.messages['='] = $.validator.messages['equalTo'];
        $.validator.methods['[]'] = $.validator.methods['range'];
        $.validator.messages['[]'] = $.validator.messages['range'];
        $.validator.addMethod("in", function (value, element, params) {
            return (this.optional(element) && !value) || qwp.in(value, params);
        });
        $.validator.addMethod("()", function (value, element, params) {
            return (this.optional(element) && !value) || (value > params[0] && value < params[1]);
        });
        $.validator.addMethod("[)", function (value, element, params) {
            return (this.optional(element) && !value) || (value >= params[0] && value < params[1]);
        });
        $.validator.addMethod("(]", function (value, element, params) {
            return (this.optional(element) && !value) || (value > params[0] && value <= params[1]);
        });
    },
    getDefaultInvalidInputText: function(ruleName) {
        if (!qwp.form._invalidateTexts) {
            qwp.form._invalidateTexts = {
                digits : $L('Digits only please'),
                letters : $L("Letters only please"),
                alphanumeric : $L("Letters, numbers, and underscores only please"),
                number : $L('Please enter valid number'),
                ipv4 : $L("Please enter a valid IPV4 address."),
                ipv6 : $L("Please enter a valid IPV6 address."),
                password: $L('Your password must contain at least one number, one lower case character and one upper case character.'),
                datehour: $L('Please input time with date and hour.'),
                datetime: $L('Please input time with date and time.'),
                _default: $L('Please enter valid values')
            }
        }
        return qwp.form._invalidateTexts[ruleName] ? qwp.form._invalidateTexts[ruleName] : qwp.form._invalidateTexts._default;
    },
    _cachedFormValidators:{}
};
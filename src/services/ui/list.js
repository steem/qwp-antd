qwp.list = {
    init: function() {
        qwp.list._tmpl = qwp.list._getTmpl();
    },
    create: function(container, name, option) {
        var o = $(container);
        option = option || {};
        option.container = container;
        if (option.autoResize !== false) option.autoResize = true;
        if (!option.did) option.did = 'id';
        o.append(qwp.list._tmpl.format(name, option.sortList ? qwp.ui.tmpl(option.sortList) : ''));
        qwp.ui.createUIComponents(o);
        $(qwp.list._b(name)).data('option', option);
        qwp.list.update(name, option.data);
        qwp.list._customize(name, option);
        if (option.maxHeight) qwp.list.updateSize(name);
    },
    load: function(name, notes, page, psize, sortf, sort, op, params) {
        $(qwp.list._s(name)).hide();
        var option = qwp.list.opt(name);
        if (!notes) notes = option.notes;
        if (!page) page = option.page;
        if (!psize) psize = option.psize;
        if (!sortf) sortf = option.sortf;
        if (!sort) sort = option.sort;
        if (!op) op = option.op;
        if (!op) op = 'list';
        var p = qwp.list._formData(name, option);
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
        qwp.list._loading(name, notes.text, option);
        qwp.get({
            url:qwp.list._createOpsURI(name, op, page, psize, sortf, sort, params),
            quiet: true,
            fn:function(res, data) {
                if (res.ret) {
                    qwp.list.update(name, data, page, psize, sortf, sort);
                    if(option.loadCallback){
                        option.loadCallback();
                    }
                } else {
                    qwp.notice(res.msg ? res.msg : (notes.failed ? notes.failed : $L('Failed to load list data')));
                    qwp.list._stopLoading(name);
                }
            }
        });
    },
    params: function(name, v) {
        var option = qwp.list.opt(name);
        if (v) option.params = v;
        return option.params;
    },
    update: function(name, data, page, psize, sortf, sort) {
        $(qwp.list._s(name)).hide();
        qwp.list._stopLoading(name);
        var container = qwp.list._b(name);
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
            $(container + '>li').remove();
            if (option.localSort) qwp.sortData(option, data, sortf, sort);
            qwp.list.addItems(name, data.data, false, true);
        } else {
            option.total = 1;
            option.totalRecords = 0;
            $(container + '>li').remove();
            if (!option.data) {
                $(container).html('<a class="list-group-item" href="#" mtag="no_item">'+(($h.i('',{'class':qwp.ui.icon('info-sign', true)}) + (option.preText || $L('Data is not loaded'))))+'</a>');
            } else {
                qwp.list.addItems(name, option.data, false, true);
            }
            if (option.onNoRecords) qwp.fn(option.onNoRecords)();
        }
        var hdr = qwp.list._h(name);
        if (option.enablePager) $(hdr + ' .qwp-list-pager-count').text(option.total).attr('title', $L('{0} pages, {1} records').format(option.total, data.total));
        if (option.checkbox) $(hdr + ' .qwp-list-s input')[0].checked = false;
    },
    addItems: function(name, data, prepend, chkSelected) {
        $(qwp.list._s(name)).hide();
        if (!data) return;
        var d = $.isArray(data) ? data : [data], h = '';
        if (d.length === 0) return;
        var container = qwp.list._b(name), first = true;
        $(container + '>a[mtag=no_item]').remove();
        var option = $(container).data('option'), dataConvertor = false, selected = false;
        if (option.dataConvertor) dataConvertor = qwp.fn(option.dataConvertor);
        for (var i = 0, cnt = d.length; i < cnt; ++i) {
            var r = {};
            $.extend(r, d[i]);
            var eq = r[option.did] == option.selID;
            if (chkSelected && eq) selected = true;
            h += qwp.list._createItem(r, name, option, i, dataConvertor, eq, first);
            if (first) first = false;
        }
        if (chkSelected && !selected) option.selID = false;
        var l = $(container);
        if (prepend) l.prepend(h);
        else l.append(h);
        for (i = 0, cnt = d.length; i < cnt; ++i) {
            $(container + qwp.list._item() + '[rid='+d[i][option.did]+']').data('r', d[i]);
        }
        var o = $(container + qwp.list._item());
        o.click(function(e){
            qwp.list.showSearch(name, false);
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            e = $(e.delegateTarget);
            var option = qwp.list.opt(name);
            var rid = e.attr('rid');
            if (option.selID === rid) {
                if (option.triggerClickWhenSelected) {
                    if (option.onSelection) qwp.fn(option.onSelection)(e.data('r'));
                }
                return;
            }
            if (option.selID) $(container + qwp.list._item() + '[rid='+option.selID+']').removeClass('active');
            option.selID = rid;
            e.addClass('active');
            if (option.onSelection) qwp.fn(option.onSelection)(e.data('r'));
        });
        if (option.popover) {
            o.mouseenter(function(e) {
                if (qwp.list._timer) {
                    clearTimeout(qwp.list._timer);
                    qwp.list._timer = false;
                    $('#list-popover-' + name).remove();
                }
                var l = $(qwp.list._b(name)), option = l.data('option');
                e = $(e.delegateTarget);
                var lpos = l.offset(), w = l.width(), popt = {pos:'right'}, win = $(window),
                    r = $(container + qwp.list._item() + '[rid='+ e.attr('rid') +']').data('r'),
                    pos = e.offset(), h = e.height() + qwp.ui.paddingTopBottom(e), wh = win.height(), ws = win.scrollTop();
                $.extend(popt, option.popover);
                var pheight = popt.height;
                if (pheight > wh) pheight = wh;
                $('body').append('<div id="list-popover-{0}" class="popover fade in qwp-list-popover {1}" style="display: none;width:{3}px;height:{4}px"><div class="arrow"></div><div class="popover-content"><div mtag="content">{2}</div></div></div>'.format(name, popt.pos, qwp.fn(popt.content)(r), popt.width, pheight));
                var top, left;
                top = pos.top + h/2 - pheight / 2;
                if (popt.pos == 'right') {
                    left = lpos.left + w;
                } else {
                    left = lpos.left - popt.width;
                }
                if (top + pheight > wh + ws) {
                    var delta = top + pheight - wh - ws;
                    top -= delta;
                    $('#list-popover-' + name + '>.arrow').css('top', (delta * 100 / pheight + 50) + '%');
                } else if (top < ws) {
                    var delta = ws - top;
                    top = ws;
                    $('#list-popover-' + name + '>.arrow').css('top', (50 - delta * 100 / pheight) + '%');
                }
                var pop = $('#list-popover-' + name), rid = r[option.did];
                qwp.ui.createUIComponents(pop);
                pop.mouseenter(function(){
                    if (qwp.list._timer) {
                        clearTimeout(qwp.list._timer);
                        qwp.list._timer = false;
                    }
                }).mouseleave(function(){
                    $('#list-popover-' + name).remove();
                });
                pop.css({top:top+'px',left:left+'px'}).show();
                pheight -= qwp.ui.paddingTopBottom(pop);
                pop = $('#list-popover-' + name + ' .popover-content');
                pheight -= qwp.ui.paddingTopBottom(pop);
                $('#list-popover-' + name + ' .popover-content div[mtag=content]').slimscroll({height: pheight + 'px'});
            }).mouseleave(function(e){
                e = $(e.delegateTarget);
                var r = $(container + qwp.list._item() + '[rid='+ e.attr('rid') +']').data('r'), option = qwp.list.opt(name), rid = r[option.did];
                qwp.list._timer = setTimeout(function(){
                    $('#list-popover-' + name).remove();
                    qwp.list._timer = false;
                }, 500);
            });
        }
        qwp.list._checkboxChange(name, d, container, option);
        qwp.ui.createUIComponents(l);
        if (option.createUIComponents) qwp.fn(option.createUIComponents)(l);
    },
    item: function (name, id) {
        return $(qwp.list._b(name) + qwp.list._item() + '[rid='+id+']').data('r');
    },
    clearAll: function(name) {
        qwp.list.update(name, qwp.list.opt(name).data);
    },
    checkAll: function(name, chk) {
        var option = qwp.list.opt(name);
        if (!option.checkbox) return;
        chk = chk ? true : false;
        var container = qwp.list._b(name);
        $(qwp.list._b(name) + qwp.list._chk()).each(function(i, o){
            if (o.checked !== chk) {
                o.checked = chk;
                if (option.onChkSelection) {
                    qwp.fn(option.onChkSelection)(o.value, o.checked, $(container + qwp.list._item() + '[rid='+ o.value +']').data('r'));
                }
            }
        });
    },
    checkSome: function(name, ids) {
        var option = qwp.list.opt(name);
        if (!option.checkbox) return;
        $(qwp.list._b(name) + qwp.list._chk()).each(function(i, o){
            if(ids.indexOf(o.value.toString()) != -1) {
                o.checked = true;
            }
        });
    },
    selectedID: function(name, byIdx, start, end) {
        var option = qwp.list.opt(name);
        if (!option.checkbox) return [];
        var ids = [];
        if (byIdx) {
            for (var i = start; i <= end; ++i) {
                ids.push($(qwp.list._b(name) + '>li:eq(' + i + ')>a').attr('rid'));
            }
        } else {
            $(qwp.list._b(name) + qwp.list._chk() + ':checked').each(function (i, o) {
                ids.push(o.value);
            });
        }
        return ids;
    },
    showSearch: function(name, show) {
        var option = qwp.list.opt(name);
        if (option.search) {
            if (show) $(qwp.list._s(name)).show();
            else $(qwp.list._s(name)).hide();
        }
    },
    activeItem: function(name, all) {
        if (all) return $(qwp.list._b(name) + qwp.list._item() + '.active').data('r');
        return qwp.list.opt(name).selID;
    },
    clearActiveItem: function(name) {
        qwp.list.opt(name).selID = false;
    },
    totalRecords: function(name) {
        return qwp.list.opt(name).totalRecords;
    },
    opt: function(name) {
        return qwp.isString(name) ? $(qwp.list._b(name)).data('option') : name.data('option');
    },
    enableHeader: function(name, enable) {
        var h = qwp.list._h(name);
        if (enable) qwp.loading.overlay.hide(h);
        else qwp.loading.overlay.show(h, true);
    },
    updateSize: function(name) {
        var o = $(qwp.list._b(name)), option = o.data('option'), hDelta = 0;
        if (option.maxHeight) {
            $(qwp.list._b(name)).slimscroll({height: (option.maxHeight)+'px'});
            return;
        }
        var pos = o.offset(), c = $(option.container);
        var h = $(window).height() - pos.top - qwp.ui.paddingTopBottom(c) - qwp.ui.borderTopBottomWidth(c) - qwp.ui.marginBottom(o) - 12;
        if (option.heightDelta) {
            if ($.isNumeric(option.heightDelta)) hDelta += parseInt(option.heightDelta);
            else hDelta += qwp.fn(option.heightDelta)();
        }
        h -= hDelta;
        $(qwp.list._b(name)).css({height:h+'px',width:'100%'}).slimscroll({height: h+'px',width: '100%'});
    },
    _checkboxChange: function(name, data, container, option) {
        if (!option.checkbox) return;
        for (var i = data.length - 1; i >= 0; --i) {
            qwp.list._setCheckboxChangeEvent(name, container, data[i], option);
        }
    },
    _setCheckboxChangeEvent: function(name, container, d, option) {
        var id = d[option.did];
        $(container + qwp.list._chk() + '[mtag=chk]').change(function(o){
            var option = qwp.list.opt(name), r = $(container + qwp.list._item() + '[rid='+id+']').data('r');
            o = $(o.delegateTarget);
            if (option.onChkSelection) qwp.fn(option.onChkSelection)(o.val(), o[0].checked, r);
            o = $(qwp.list._b(name) + qwp.list._chk() + ':checked');
            var e = $(qwp.list._h(name) + ' .qwp-list-s input');
            if (e.length > 0) e[0].checked = o.length > 0;
        });
    },
    _createItem: function(r, name, option, i, dataConvertor, active, first) {
        var did = r[option.did], h = dataConvertor ? dataConvertor(r, did, first) : '';
        if (!qwp.isString(h)) {
            h = $h.h4(h.title, {'class':'list-group-item-heading'}) + $h.p(h.text, {'class':'list-group-item-text'});
        }
        if (option.checkbox) h += $h.checkbox({value:did, mtag:'chk'});
        return $h.li($h.a(h, {'class': r._cls ? r._cls : 'list-group-item' + (active ? ' active ' : ''), href: '#', mtag: 'item', rid: did}));
    },
    _customize: function(name, option) {
        var container = qwp.list._h(name);
        if (option.enablePager || option.search || option.sortList || option.checkbox) {
            if (option.enablePager) {
                $(container + ' .qwp-list-pager-input').click(function (o) {
                    o = $(o.delegateTarget);
                    o.addClass('open');
                    $(container + ' .qwp-list-pager-input input').focus().select().css('width', (o.width() - 2) + 'px');
                });
                $(container + ' .qwp-list-pager-input input').change(function (o) {
                    $(container + ' .qwp-list-pager-input span').text($(o.target).val());
                });
            } else {
                $(container + ' .qwp-list-pager').hide();
            }
            if (option.search) {
                var s = qwp.list._s(name);
                $(s).append(qwp.ui.tmpl(option.search));
                $(s + ' button[qwp=list-search-close]').click(function(){
                    $(qwp.list._s(name)).toggle(200);
                });
                $(container + ' .qwp-list-search').click(function(){
                    var p = $(qwp.list._b(name));
                    var o = p.offset();
                    $(qwp.list._s(name)).css('width', p.width() + 'px').css({left: '0', top: '0'}).toggle(200);
                });
                $(s + ' button[qwp=list-search-submit],'+s + ' a[qwp=list-search-submit]').click(function(){
                    $(qwp.list._s(name)).toggle(200);
                    qwp.list.load(name);
                    return false;
                });
            } else {
                $(container + ' .qwp-list-search').hide();
            }
            if (option.sortList) {
                $(container + ' .qwp-list-s > ul > li').show();
                $(container + " .qwp-list-s a[qwp=sort-options]").click(function(o){
                    o = $(o.delegateTarget);
                    $(container + ' .qwp-list-s .dropdown-menu').css({top: (o.position().top + o.height() + 1) + 'px', left: o.position().left + 'px'});
                });
                $(container + ' .qwp-list-s .dropdown-menu>li').click(function(e){
                    e = $(e.delegateTarget);
                    var option = qwp.list.opt(name), sortf = e.data('field');
                    if (option.sortf == sortf) return;
                    if (option.sortf) $(qwp.list._h(name) + " .qwp-list-s .dropdown-menu>li[data-field='"+option.sortf+"']").removeClass('active');
                    option.sortf = sortf;
                    $(qwp.list._h(name) + " .qwp-list-s .dropdown-menu>li[data-field='"+sortf+"']").addClass('active');
                    qwp.list.load(name);
                });
            } else {
                $(container + ' .qwp-list-s > li').hide();
            }
            if (option.checkbox) {
                $(container + ' .qwp-list-s input').change(function(e){
                    qwp.list.checkAll(name, e.delegateTarget.checked);
                });
            } else {
                $(container + ' .qwp-list-s input').hide();
            }
            if (option.autoHideHeader) {
                $(option.container).mouseenter(function(){
                    $(qwp.list._h(name)).show(200, function(){
                        qwp.list.updateSize(name);
                    });
                }).mouseleave(function(){
                    $(qwp.list._h(name)).hide(200, function(){
                        qwp.list.updateSize(name);
                    });
                });
            } else {
                $(container).show();
            }
            qwp.loading.overlay.create(container);
        }
        if (option.autoResize) qwp.list._createResize(name);
    },
    _loading: function(name, txt, option) {
        qwp.ui.overlay(true, txt, qwp.list._b(name), false, false, (option.enablePager || option.search || option.sortList || option.checkbox) ? '0' : '33px');
    },
    _stopLoading: function(name) {
        qwp.ui.overlay(false, false, qwp.list._b(name));
    },
    _h: function(name) {
        return '#qwp-list-header-' + name;
    },
    _b: function(name) {
        return '#qwp-list-' + name;
    },
    _s: function(name) {
        return '#qwp-list-search-' + name;
    },
    _chk: function(){
        return '>li>a>input[type=checkbox]';
    },
    _item: function() {
        return '>li>a[mtag=item]';
    },
    _timer: false,
    _goPage: function(name, p) {
        var option = qwp.list.opt(name), o = $(qwp.list._h(name) + ' input[qwp=number]'), v = parseInt(o.val());
        if (p == 'f') p = '1';
        else if (p == 'p') p = v - 1;
        else if (p == 'n') p = v + 1;
        else if (p == 'l') p = option.total;
        p = parseInt(p);
        if (p <= 0) p = 1;
        else if (p > option.total) p = option.total;
        o.val(p);
        option.page = p;
        qwp.list.load(name);
    },
    _changeOrder: function(name, o) {
        var option = qwp.list.opt(name), sort = option.sort == 'desc' ? 'asc' : 'desc';
        option.sort = sort;
        o = $(o).find('>i');
        if (sort == 'desc') {
            o.removeClass('glyphicon-arrow-up');
            o.addClass('glyphicon-arrow-down');
        } else {
            o.removeClass('glyphicon-arrow-down');
            o.addClass('glyphicon-arrow-up');
        }
        qwp.list.load(name);
    },
    _formData: function(name, option) {
        if (option.getSearchFormData) return qwp.fn(option.getSearchFormData)();
        return option.search ? $(qwp.list._s(name) + ' form').serialize() : '';
    },
    _getTmpl: function() {
        return '<table class="qwp-list-header" id="qwp-list-header-{0}" style="display:none;">'+
        '<tr><td class="qwp-list-pager"><ul class="pagination"><li><a onclick="qwp.list._goPage(\'{0}\', \'f\')" href="#" title="'+$L('First page')+'" role="button"><i class="glyphicon glyphicon-step-backward"></i></a></li>'+
        '<li><a onclick="qwp.list._goPage(\'{0}\', \'p\')" href="#" title="'+$L('Previous page')+'" role="button"><i class="glyphicon glyphicon-chevron-left"></i></a></li>'+
        '<li><a onclick="qwp.list._goPage(\'{0}\', \'n\')" href="#" title="'+$L('Next page')+'" role="button"><i class="glyphicon glyphicon-chevron-right"></i></a></li>'+
        '<li><a onclick="qwp.list._goPage(\'{0}\', \'l\')" href="#" title="'+$L('Last page')+'" role="button"><i class="glyphicon glyphicon-step-forward"></i></a></li>'+
        '<li><a class="qwp-list-pager-input" title="'+$L('Press enter to switch page')+'"><span>1</span>' +
        '<input onblur="this.parentNode.className=this.parentNode.className.replace(\' open\', \'\')" qwp="number" props="defaultValue=1|minValue=1|enter=qwp.list._goPage(\'{0}\', this.value)" type="text" size="2" value="1" title="'+$L('Press enter to switch page')+'"></a></li>'+
        '<li><a class="qwp-list-search"><i class="glyphicon glyphicon-search" title="'+$L('Click to show search options')+'"></i></a></li>'+
        '<li><a class="qwp-list-pager-count" qwp="count">0</a></li>'+
        '</ul></td>'+
        '<td class="qwp-list-s" align="right">'+
        '<ul class="pagination"><li><a qwp="sort-options" title="'+$L('Click to show sort option')+'" class="tooltip-info dropdown-toggle" data-toggle="dropdown" role="button"><i class="glyphicon glyphicon-sort-by-attributes"></i></a><ul class="dropdown-menu">{1}</ul></li>'+
        '<li><a onclick="qwp.list._changeOrder(\'{0}\', this)" href="#" title="'+$L('Click to toggle sort order')+'" role="button"><i class="glyphicon glyphicon-arrow-down"></i></a></li>'+
        '<input title="'+$L('Click to select all the items')+'" type="checkbox"></ul></td></tr></table>'+
        '<ul class="qwp-list list-group" id="qwp-list-{0}"><div id="qwp-list-search-{0}" style="display: none;z-index: 3;position: absolute;"></div></ul>';
    },
    _createOpsURI: function(name, ops, page, psize, sortf, sort, params) {
        var p = qwp.uri.createPagerParams(page, psize, sortf, sort);
        var option = qwp.list.opt(name);
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
        var resize = function(){
            qwp.list.updateSize(name);
        };
        resize();
        qwp.ui.resize(resize, true, qwp.list._b(name));
    }
};
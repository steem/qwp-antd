qwp.panelPager = {
    create: function(container, option) {
        var c = $(container);
        c.data('option', option).data('_pager', 1);
        qwp.panelPager._createComponent(c, option, true, container);
    },
    load: function(container, params) {
        var option = qwp.panelPager.opt(container), ops = {};
        qwp.ui.overlay(true, option.loadingNotes ? option.loadingNotes : false, container);
        if (qwp.isString(option.ops)) ops.name = option.ops;
        else ops = option.ops;
        qwp.get({
            url:qwp.uri.ops(ops.name, ops.p, params, ops.m),
            quiet: true,
            timeout: 180000,
            fn:function(res, data) {
                qwp.ui.overlay(false, false, container, true);
                if (res.ret) {
                    var option = $(container).data('option');
                    qwp.fn(option.onLoad)(data);
                } else {
                    qwp.notice(res.msg ? res.msg : $L('Failed to load list data'));
                }
            }
        });
    },
    getPage:function(container){
        var p = $(container).data('_pager');
        return p ? p : 1;
    },
    setPage:function(container, p){
        return $(container).data('_pager', p);
    },
    append: function (container, html, info) {
        var c = $(container);
        if (html && html.length > 0) $(container + ' .no-pager-data').hide();
        var page = c.data('_pager');
        $(container + ">div[pp-pager='" + page + "']").html(html).css('display', 'block');
        c.data('_pager', page + 1);
        var option = c.data('option');
        qwp.panelPager._createComponent(c, option, false);
        c.find('>.pp-more-pager>a>.pp-show-info').html(info);
        qwp.ui.createUIComponents(c);
        if (option.createUIComponents) qwp.fn(option.createUIComponents)(c);
    },
    opt: function(container) {
        return $(container).data('option', option);
    },
    getPage:function(container){
        return $(container).data('_pager');
    },
    setPage:function(container, p){
        return $(container).data('_pager', p);
    },
    getTotalPage:function(container){
        return $(container).data('_totalpager');
    },
    setTotalPage:function(container, p){
        return $(container).data('_totalpager', p);
    },
    _createComponent: function(c, option, first, container) {
        var h = '<div class="no-pager-data"></div></div><div pp-pager="{0}" class="pp-pager" style="display:none;"></div>'.format(c.data('_pager'));
        if (first) {
            h += '<div class="pp-more-pager list-group"><a href="#" class="list-group-item">{0}<span class="pp-show-info"></span></div></a>'.format(option.txtLoadMore ? option.txtLoadMore : $L('Load more data.'));
            c.html(h);
            if (option.noDataPrompt) $(container + ' .no-pager-data').html(option.noDataPrompt);
            var fn;
            if (option.loadMoreData) {
                fn = qwp.fn(option.loadMoreData);
            } else {
                fn = function() {
                    var option = qwp.panelPager.opt(container), params = null;
                    if (option.getParams) params = qwp.fn(option.getParams)();
                    qwp.panelPager.load(container, params);
                };
            }
            c.find('>.pp-more-pager').click(fn);
        } else {
            c.find('>.pp-more-pager').before(h);
        }
    }
};
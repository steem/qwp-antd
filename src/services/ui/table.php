<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_ui_init_table() {
    static $is_inited;
    if (isset($is_inited)) {
        return;
    }
    $is_inited = true;
    qwp_render_add_loading();
?>
<qwp tmpl="table_base">
    <div class="row" qwp="{0}-op-row">
        <div class="col-sm-{3}" qwp="table-top-left"><div class="toolbar"><div class="btn-group" style="width: 100%">{1}</div></div></div>
        <div class="col-sm-{4}" id="{0}_top_right" qwp="table-top-right"></div>
    </div>
    <div class="row" qwp="{0}-data-row">
        <div class="col-xs-12" id="{0}_table_container" qwp="container">{2}</div>
    </div>
</qwp>
<?php
}
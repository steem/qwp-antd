<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_ui_init_dialog() {
    static $is_inited;
    if (isset($is_inited)) {
        return;
    }
    $is_inited = true;
?>
<qwp tmpl="dialog_base">
<div class="modal fade" tabindex="-1" role="dialog" id="{id}" style="display: none;z-index:{z-index};margin-top:{margin-top};" aria-hidden="true" qwp="dialog" data-backdrop="static" data-keyboard="false">
<div class="modal-dialog" style="width:{width}">
    <div class="modal-content" style="width:{width};">
        <div class="modal-header" style="font-weight: bold">
            <div class="table-header">
                <span qwp="img"></span>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <span class="white">×</span>
                </button>
                <span qwp="title">{title}</span>
            </div>
        </div>
        <div class="modal-body" style="height:{height};padding: 8px;">{content}</div>
        <div class="modal-footer no-top-margin">
            <div qwp="btns-left" style="float: left"></div>
            <div qwp="btns-right" style="float: right">
                <button class="btn btn-sm btn-info" qwp="ok" data-dismiss="modal"><i class="glyphicon glyphicon-ok"></i><span qwp="txt-ok"></span></button>
                <button class="btn btn-sm btn-danger" qwp="cancel" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i><span qwp="txt-cancel"></span></button>
            </div>
        </div>
    </div>
</div>
</div>
</qwp>
<?php
}
function qwp_create_dialog($dialog_id, $options)
{
    global $QWP_DIALOGS;

    if (!isset($QWP_DIALOGS)) {
        $QWP_DIALOGS = array();
    }
    if (!isset($options['url']) && !isset($options['content'])) {
        $options['tmpl'] = $dialog_id;
    }
    $QWP_DIALOGS[$dialog_id] = $options;
}
function qwp_create_dialog_with_form($dialog_id, $options, $form_name)
{
    global $QWP_DIALOGS;

    if (!isset($QWP_DIALOGS)) {
        $QWP_DIALOGS = array();
    }
    if (!isset($options['url']) && !isset($options['content'])) {
        $options['tmpl'] = $dialog_id;
    }
    $QWP_DIALOGS[$dialog_id] = $options;
    qwp_render_import_form($form_name);
}
function qwp_create_dialog_with_file($dialog_id, $options, $file_name)
{
    global $QWP_DIALOGS;

    if (!isset($QWP_DIALOGS)) {
        $QWP_DIALOGS = array();
    }
    if (!isset($options['url']) && !isset($options['content'])) {
        $options['tmpl'] = $dialog_id;
    }
    $QWP_DIALOGS[$dialog_id] = $options;
    global $MODULE_ROOT;
    require_once(join_paths($MODULE_ROOT, $file_name . '.php'));
}
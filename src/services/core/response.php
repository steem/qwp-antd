<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_set_response_type() {
    global $qwp_response_type;

    if (isset($qwp_response_type) && !empty($qwp_response_type)) {
        set_content_type($qwp_response_type);
    } else {
        set_content_type(QWP_TP_JSON);
    }
}
function qwp_create_json_response($result, $msg, $msg_type = 'error', $additional_fields = null) {
    $json = array(QWP_OPS_RET => $result);
    if ($msg) $json[QWP_OPS_MSG] = $msg;
    if ($additional_fields) {
        copy_from($json, $additional_fields);
    }
    if ($msg_type) {
        $json[QWP_OPS_MSG_TYPE] = $msg_type;
    }
    return $json;
}
function qwp_echo_json_response($result, $msg = false, $msg_type = 'error', &$data = null, $additional_fields = null) {
    if (!$result && $msg === false) $msg = L("Invalid parameters");
    $msg = qwp_create_json_response($result, $msg, $msg_type, $additional_fields);
    if ($data) {
        $msg['data'] = $data;
    }
    $jsonp = P('callback');
    $is_jsonp = $jsonp && starts_with($jsonp, 'jsonp_');
    if ($is_jsonp) echo("$jsonp(");
    echo_json($msg);
    if ($is_jsonp) echo(")");
}
function qwp_create_and_echo_json_response($result, $msg = false, $msg_type = 'error', &$data = null, $additional_fields = null) {
    set_content_type(QWP_TP_JSON);
    if (!$result && $msg === false) $msg = L("Invalid parameters");
    $msg = qwp_create_json_response($result, $msg, $msg_type, $additional_fields);
    if ($data) {
        $msg['data'] = $data;
    }
    $jsonp = P('callback');
    $is_jsonp = $jsonp && starts_with($jsonp, 'jsonp_');
    if ($is_jsonp) echo("$jsonp(");
    echo_json($msg);
    if ($is_jsonp) echo(")");
}
function qwp_create_text_response($text) {
    set_content_type(QWP_TP_TEXT_PLAIN);
    echo($text);
}
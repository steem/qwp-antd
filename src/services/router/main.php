<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
try {
    require_once(QWP_ROUTER_ROOT . '/required.php');
    do {
        session_start();
        qwp_initialize_language();
        if (P('op') === '_l') {
            global $lang_txts;
            qwp_load_lang_for_module('global');
            $l = array('/', $lang_txts);
            qwp_create_and_echo_json_response(true, false, false, $l);
            break;
        }
        if (qwp_initialize() === false) {
            qwp_render_bad_request();
            break;
        }
        if (qwp_security_check() === false) {
            qwp_render_security_error();
            break;
        }
        if (qwp_render_page() === false) {
            qwp_render_bad_request();
        }
    } while (false);
} catch (Exception $e) {
    qwp_render_system_exception($e);
}
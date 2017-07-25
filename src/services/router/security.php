<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_is_logined() {
    global $USER;

    return $USER->role !== QWP_ROLE_VISITOR;
}
function qwp_initialize_login() {
    global $USER;

    $USER = C('u');
    if (!$USER) {
        qwp_create_visitor_user();
    }
}
function qwp_security_check() {
    qwp_initialize_login();
    require_once(QWP_MODULE_ROOT . '/security.php');
    if (qwp_custom_need_login() === true && !qwp_is_logined()) {
        return false;
    }
    return qwp_custom_security_check();
}

function qwp_get_acls() {

}


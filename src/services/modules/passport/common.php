<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
if (!QWP_IN_MOCK_TEST) {
    global $PAGE, $OP;
    if (!$PAGE && !$OP && qwp_is_logined()) {
        TO('./');
    }
}
function qwp_init_login(&$u) {
    global $USER;

    $USER = $u;
    _C('u', $USER);
    require_once(QWP_SECURITY_ROOT . '/security.php');
    qwp_init_security($acls);
}
function qwp_logout() {
    _C('u');
    _C('acls');
    _C('nav');
}
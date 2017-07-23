<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
// you can delete this line to implement your own security check
require_once(QWP_ROOT . '/security/security.php');

// return false to indicate no need to login
// you need to modify it
// portal module is just a sample, you can delete it if you don't want it
function qwp_custom_need_login() {
    global $MODULE_URI, $MODULE, $PAGE, $OP;

    if (qwp_is_passport_module() || qwp_is_portal_module()) {
        return false;
    }
    return true;
}
// return false to indicate failed to check security
// you need to modify it
function qwp_custom_security_check() {
    return qwp_doing_security_check();
}
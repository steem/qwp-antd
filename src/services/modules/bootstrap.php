<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_custom_initialize_check() {
    global $MODULE, $PAGE, $OP;

}
// pre-check whether the ops is allowed, eg. check the operation count limitation per user
// return false for failed to check and set the $msg for error information
function qwp_ops_pre_check(&$msg) {
    global $MODULE, $OP;

}
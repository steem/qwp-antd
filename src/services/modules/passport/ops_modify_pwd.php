<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function modify_pwd(&$msg, &$data) {
    if (!qwp_is_logined()) return false;
    db_update('sys_user')->fields(array(
        'pwd' => md5(F('pwd')),
    ))->condition('id', qwp_get_logined_user_id())
        ->condition('pwd', md5(F('old_pwd')))->execute();
    $msg = L('Modify password successfully');
}
qwp_set_form_processor('modify_pwd');
qwp_set_form_validator('modify_pwd');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
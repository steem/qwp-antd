<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_validate_login(&$msg, &$data) {
    $ret = db_select('sys_user', 'u')->fields('u', array('id', 'name', 'role'))
        ->condition('account', F('user'))
        ->condition('pwd', md5(F('pwd')))
        ->execute();
    if ($ret->rowCount() !== 1) {
        $msg = L('Password is not correct');
        return false;
    }
    $r = $ret->fetchAssoc();
    $data['topTo'] = qwp_get_dst_url();
    $user = new QWPUser(intval($r['id']), intval($r['role']), $r['name'], $r['name'], $r['name']);
    qwp_init_login($user);
    $msg = L('Login successfully');
}
qwp_set_form_processor('qwp_validate_login');
qwp_set_form_validator('login');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
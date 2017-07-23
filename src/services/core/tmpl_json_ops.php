<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('IN_MODULE')){exit('Invalid Request');}
require_once(QWP_CORE_ROOT . '/validator.php');
function _qwp_process_ops(&$msg, &$data, &$msg_type, &$ret) {
    global $FN_PROCESS_NEED_TRANSACTION;
    $ctx = false;
    if ($FN_PROCESS_NEED_TRANSACTION) $ctx = db_transaction();
    try {
        global $FN_PROCESS_OPS;
        if (isset($FN_PROCESS_OPS)) {
            if ($FN_PROCESS_OPS($msg, $data) !== false) {
                $msg_type = "info";
                $ret = true;
            }
        } else {
            $msg = L("No ops processor!");
        }
    } catch (PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            if (!$msg) $msg = L("Duplicated record when doing ops, please check the parameters!");
        } else {
            $msg = L("Failed to execute query: ") . (IN_DEBUG ? $e->query_string : $e->getMessage());
        }
    } catch (Exception $e) {
        $msg = L("Exception happens: ") . $e->getMessage();
    }
    if ($ret !== true && $ctx) $ctx->rollback();
}
set_content_type(QWP_TP_JSON);
$msg_type = "error";
$ret = false;
$msg = "";
$data = array();
do {
    global $F;
    if (!isset($F)) {
        break;
    }
    if (qwp_ops_pre_check($msg) === false) {
        break;
    }
    $msg = qwp_validate_form();
    if ($msg !== true) {
        break;
    }
    $msg = "";
    if (qwp_custom_validate_form($msg) === false) {
        break;
    }
    _qwp_process_ops($msg, $data, $msg_type, $ret);
} while (false);
if (!$ret && !$msg) {
    $msg = L("Invalid parameters");
}
try {
    qwp_custom_ops_logger($ret, $msg);
} catch (Exception $e) {
    log_exception($e, 'ops logger error');
}
qwp_echo_json_response($ret, $msg, $msg_type, $data);
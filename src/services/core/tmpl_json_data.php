<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('IN_MODULE')){exit('Invalid Request');}
global $FN_PROCESS_NEED_TRANSACTION;
do {
    set_content_type(QWP_TP_JSON);
    $msg_type = "error";
    $ret = false;
    $msg = "";
    $data = array();
    $ctx = false;
    if ($FN_PROCESS_NEED_TRANSACTION) $ctx = db_transaction();
    try {
        global $FN_PROCESS_DATA;
        if (isset($FN_PROCESS_DATA)) {
            if ($FN_PROCESS_DATA($msg, $data) !== false) {
                $msg_type = "info";
                $ret = true;
            }
        } else {
            $msg = L("No data processor!");
        }
    } catch (PDOException $e) {
        $msg = L("Failed to execute query: ") . (IN_DEBUG && $e->query_string ? $e->query_string : $e->getMessage());
    } catch (Exception $e) {
        $msg = L("Exception happens: ") . $e->getMessage();
    }
    if ($ret !== true && $ctx) $ctx->rollback();
} while (false);
if (!$ret && !$msg) {
    $msg = L("Invalid parameters");
}
qwp_echo_json_response($ret, $msg, $msg_type, $data);
<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

$tables = array();
get_user_data_modal($object_modal);
qwp_db_get_table_header_from_modal($object_modal, $object_header);
$tables['userList'] = $object_header;

$app_settings = array(
    'tables' => $tables,
);
qwp_render_app_settings($app_settings);
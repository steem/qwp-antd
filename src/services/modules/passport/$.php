<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
if (QWP_IN_MOCK_TEST) {
    $user = new QWPUser(0, 1, 'Mock', 'Mock', 'admin');
    //qwp_init_login($user);
}
$app_settings = array(
    'acls' => C('nav', array()),
    'default' => 'sample',
);
if (qwp_is_logined()) {
    global $USER;

    $app_settings['user'] = array(
        'id' => $USER->uid,
        'username' => $USER->name,
        'role' => $USER->role,
        'roleName' => $USER->role_name,
        'createTime' => $USER->create_time ? $USER->create_time : (QWP_IN_MOCK_TEST ? get_datetime_string(time()) : '--'),
    );
}
qwp_render_app_settings($app_settings);
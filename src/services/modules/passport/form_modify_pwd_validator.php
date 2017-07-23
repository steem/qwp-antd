<?php
$form_rule = array(
    'cssSelector' => '#pwd_info',
    'name' => 'changePassword',
    'rules' => array(
        'old_pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            'password' => true,
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            'password' => true,
        ),
        'pwd1' => array(
            'required' => true,
            '=' => array('#f_pwd', 'pwd'),
        ),
    ),
    'confirmDialog' => 'qwp_mbox',
    'mbox' => array(
        'title' => L('Operation confirmation'),
        'message' => L('Are you sure to change the password?'),
    ),
    'actionMessage' => L('New password is being saved, please wait...'),
    'actionHandler' => 'opsCallback',
);
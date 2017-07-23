<?php
$form_rule = array(
    'cssSelector' => '#form-signin',
    'rules' => array(
        'user' => array(
            'required' => true,
            'alphanumeric' => true,
            'rangelength' => array(3, 32),
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            'password' => true,
        ),
    ),
    'actionMessage' => L('Login is in processing, please wait...'),
    'invalidHandler'  => 'loginInvalidHandler',
    'beforeSubmit' => 'loginBeforeSubmit',
    'actionHandler' => 'loginActionHandler',
);
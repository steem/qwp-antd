<?php
$form_rule = array(
    'cssSelector' => '#form-signin',
    'name' => 'createUser',
    'rules' => array(
        'name' => array(
            'required' => true,
            'rangelength' => [6, 16],
        ),
        'nickName' => array(
            'required' => true,
            'rangelength' => [6, 16],
        ),
        'phone' => array(
            'required' => true,
            'rangelength' => [6, 16],
            'digits' => true,
        ),
        'age' => array(
            'required' => true,
            'digits' => true,
        ),
        'email' => array(
            'required' => true,
            'email' => true,
        ),
        'address' => array(
            'required' => true,
            'rangelength' => [3, 128],
        ),
    ),
    'actionMessage' => L('Login is in processing, please wait...'),
    'invalidHandler'  => 'loginInvalidHandler',
    'beforeSubmit' => 'loginBeforeSubmit',
    'actionHandler' => 'loginActionHandler',
);
<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

if (QWP_IN_MOCK_TEST) {
  $user = new QWPUser(0, 1, 'Mock', 'Mock', 'Mock');
  qwp_init_login($user);
}
$app_settings = array(
  'default' => DEFAULT_MODULE,
  'moduleSep' => QWP_MODULE_SEP,
  'enableHeaderNav' => true,
  'headerNav' => array(array('name' => 'sample', 'icon' => 'laptop'), array('name' => 'system', 'icon' => 'laptop')),
  'acls' => array(
    C('nav', array()),
    C('sub_nav', array()),
  )
);
if (qwp_is_logined()) {
  
}
qwp_render_app_settings($app_settings);
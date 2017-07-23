<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

$app_settings = array(
  'defaultCompnent' => DEFAULT_MODULE,
);
if (qwp_is_logined()) {
  
}
qwp_render_app_settings($app_settings);
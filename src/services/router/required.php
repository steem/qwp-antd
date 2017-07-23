<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
require_once(QWP_INC_ROOT . '/common.php');
require_once(QWP_INC_ROOT . '/logger.php');
require_once(QWP_LANG_ROOT . '/main.php');
require_once(QWP_INC_ROOT . '/db.php');
require_once(QWP_ROUTER_ROOT . '/common.php');
require_once(QWP_ROUTER_ROOT . '/render.php');
require_once(QWP_CORE_ROOT . '/user.php');
require_once(QWP_CORE_ROOT . '/response.php');
require_once(QWP_ROUTER_ROOT . '/security.php');
require_once(QWP_COMMON_ROOT . '/common.php');
require_once(QWP_MODULE_ROOT . '/ops_logger.php');
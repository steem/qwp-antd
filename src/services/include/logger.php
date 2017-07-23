<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
require_once(QWP_INC_ROOT . '/log4php/Logger.php');
function initialize_logger($name) {
    if (!ENABLE_LOGGER) {
        return;
    }
    global $logger;
    Logger::configure(array(
        'rootLogger' => array(
            'appenders' => array('default'),
        ),
        'appenders' => array(
            'default' => array(
                'class' => 'LoggerAppenderRollingFile',
                'layout' => array(
                    'class' => 'LoggerLayoutPattern',
                    "params" => array(
                        "ConversionPattern" => "%d{ISO8601} [%p] %m (at %F line %L)%n"
                    )
                ),
                'params' => array(
                    'file' => join_paths(QWP_LOG_DIR, $name . '.log'),
                    'append' => true,
                    'MaxFileSize' => '10MB',
                    'MaxBackupIndex' => '3'
                )
            )
        )
    ));
    $logger = Logger::getRootLogger();
}
function log_info($message) {
    if (!ENABLE_LOGGER) {
        return;
    }
    global $logger;
    $logger->info($message);
}
function log_error($message) {
    if (!ENABLE_LOGGER) {
        return;
    }
    global $logger;
    $logger->error($message);
}
function log_exception(&$e, $tag) {
    if (!ENABLE_LOGGER) {
        return;
    }
    global $logger;
    $logger->warn($tag . " Other exception is: " . $e->getMessage() . $e->getTraceAsString());
}
function log_db_exception(&$e, $tag) {
    if (!ENABLE_LOGGER) {
        return;
    }
    global $logger;
    $logger->warn($tag . "DB exception is: " . $e->getMessage() . $e->getTraceAsString());
}
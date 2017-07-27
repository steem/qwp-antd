<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_render_initializer() {
    global $JS_CODE_FILES, $JS_FILES, $CSS_CODE_FILES, $CSS_FILES, $PHP_JS_FILES, $PHP_CSS_FILES, $FORM_VALIDATOR, $FORMS;

    $JS_CODE_FILES = array();
    $JS_FILES = array();
    $CSS_CODE_FILES = array();
    $CSS_FILES = array();
    $PHP_JS_FILES = array();
    $PHP_CSS_FILES = array();
    $FORM_VALIDATOR = array();
    $FORMS = array();
}
function qwp_render_page() {
    // define the global variables you may use. Those variables in your module file directly
    // don't need to add global variables declarations again and you must not overwrite them.
    global $USER, $OP, $PAGE, $TEMPLATE_PATH, $MODULE_FILE, $MODULE, $MODULE_ROOT, $MODULE_URI, $MODULE_BASE_PATH;

    $_PAGE_FILES = array();
    qwp_get_common_php_files($_PAGE_FILES);
    if (empty($OP)) {
        qwp_render_initializer();
        $TEMPLATE_PATH = qwp_get_template_path();
        if ($TEMPLATE_PATH === false || qwp_initialize_module() === false) {
            return false;
        }
        $_PAGE_FILES[] = QWP_TEMPLATE_ROOT . '/common.php';
        qwp_add_common_css_js_code(QWP_TEMPLATE_ROOT);
        qwp_add_common_css_js_code($TEMPLATE_PATH);
        qwp_add_page_css_js_code();
        $file_path = $MODULE_BASE_PATH . '.init.php';
        if (file_exists($file_path)) {
            $_PAGE_FILES[] = $file_path;
        }
        $_PAGE_FILES[] = $TEMPLATE_PATH . '/header.php';
        $_PAGE_FILES[] = $MODULE_FILE;
        $file_path = $MODULE_BASE_PATH . '.footer.php';
        if (file_exists($file_path)) {
            $_PAGE_FILES[] = $file_path;
        }
        $_PAGE_FILES[] = $TEMPLATE_PATH . '/footer.php';
    } else {
        qwp_initialize_ops();
        if (MODULE_FILE)
        if (file_exists($MODULE_FILE)) {
            $_PAGE_FILES[] = $MODULE_FILE;
        } else {
            if ($OP === QWP_SERVICE_INFO_OP) {
                qwp_render_app_settings();
                return true;
            }
            return false;
        }
    }
    foreach ($_PAGE_FILES as $__item) {
        require_once($__item);
    }
    if (!$OP) {
        qwp_render_footer();
        global $PHP_JS_FILES;
        foreach ($PHP_JS_FILES as $file_path => $v) {
            require_once($file_path);
        }
        echo('</body></html>');
    }
}
function qwp_check_just_service() {
    global $OP;

    if (QWP_JUST_SERVICE && !$OP) {
        exit('Invalid Request');
    }
    return false;
}
function qwp_render_root_app_settings() {
    global $MODULE, $OP;

    if ($MODULE || $OP !== QWP_SERVICE_INFO_OP) return false;

    $app_settings = array(
        'default' => DEFAULT_MODULE,
        'moduleSep' => QWP_MODULE_SEP,
        'enableHeaderNav' => QWP_ENABLE_HEADER_NAV,
        'lang' => array(),
    );
    $lang = null;
    qwp_try_load_lang_for_module('global', $lang);
    if ($lang) {
        $app_settings['lang'][] = array('/', $lang);
    }
    qwp_load_lang_for_module('passport');
    if (isset($lang_txts) && $lang_txts) $app_settings['lang'][] = array('/', $lang_txts);
    qwp_render_app_settings($app_settings);
    return true;
}
function qwp_render_css() {
    global $CSS_FILES, $CSS_CODE_FILES, $PHP_CSS_FILES;
    global $USER, $OP, $PAGE, $TEMPLATE_PATH, $MODULE_FILE, $MODULE, $MODULE_ROOT, $MODULE_URI, $MODULE_BASE_PATH;

    foreach ($CSS_FILES as $file_name => $v) {
        echo_line('<link href="css/' . $file_name . "?v=" . QWP_PRODUCT_VERSION . '" rel="stylesheet" type="text/css" />');
    }
    echo_line('<link href="css/qwp.css?v=' . QWP_PRODUCT_VERSION .'" rel="stylesheet" />');
    if (count($CSS_CODE_FILES) > 0) {
        echo_line("<style>");
        foreach ($CSS_CODE_FILES as $file_path => $v) {
            echo_file($file_path);
        }
        echo_line("\n</style>");
    }
    foreach ($PHP_CSS_FILES as $file_path => $v) {
        require_once($file_path);
    }
}
function qwp_create_page_info() {
    global $S, $FORM_VALIDATOR, $FORMS, $PAGE, $MODULE_URI;

    $validators = array();
    foreach ($FORM_VALIDATOR as $item) {
        $selector = $item['cssSelector'];
        unset($item['cssSelector']);
        $validators[$selector] = $item;
    }
    $qwp_page = array(
        'validator' => $validators,
        'forms' => $FORMS,
        'inputRules' => get_input_rules(),
        'search' => $S,
        'm' => $MODULE_URI,
        'p' => $PAGE,
        'page' => P('page', ''),
        'pageSize' => P('psize', ''),
        'sort' => P('sort', ''),
        'sortf' => P('sortf', ''),
    );
    global $QWP_DIALOGS;
    $qwp_components = array();
    if (isset($QWP_DIALOGS)) {
        $qwp_components['dialogs'] = $QWP_DIALOGS;
    }
    echo('<script>qwp.page=' . to_json($qwp_page) . ';qwp.components=' . to_json($qwp_components) . ';jQuery($READY);</script>');
}
function qwp_render_js() {
    global $JS_FILES, $JS_CODE_FILES;
    global $USER, $OP, $PAGE, $TEMPLATE_PATH, $MODULE_FILE, $MODULE, $MODULE_ROOT, $MODULE_URI, $MODULE_BASE_PATH;

    foreach ($JS_FILES as $file_name => $v) {
        echo('<script src="js/' . $file_name ."?v=".QWP_PRODUCT_VERSION."\"></script>\n");
    }
    if (count($JS_CODE_FILES) > 0) {
        echo_line("<script>");
        foreach ($JS_CODE_FILES as $file_path => $v) {
            echo_file($file_path);
        }
        echo_line("\n</script>");
    }
    qwp_create_page_info();
}
function qwp_render_bad_request() {
    $txt = L('Bad request');
    if (qwp_is_ops_request()) {
        qwp_create_and_echo_json_response(false, $txt);
    } else {
        $txt .= '<br /><a href="./">' . L('Go to home page') . '</a>';
        qwp_render_error_page($txt);
    }
}
function qwp_render_error_page(&$error_description) {
    global $TEMPLATE_PATH;

    $file_path = '';
    $css_file_path = '';
    qwp_render_initializer();
    qwp_add_common_css_js_code(QWP_TEMPLATE_ROOT);
    if (qwp_custom_need_login() && qwp_is_logined()) {
        if ($TEMPLATE_PATH) {
            $file_path = $TEMPLATE_PATH . '/error.php';
            $css_file_path = $TEMPLATE_PATH . '/error.css';
            if (!file_exists($file_path)) {
                $TEMPLATE_PATH = QWP_TEMPLATE_ROOT . '/admin';
                $file_path = $TEMPLATE_PATH . '/admin/error.php';
                $css_file_path = $TEMPLATE_PATH . '/admin/error.css';
                if (!file_exists($file_path)) {
                    $TEMPLATE_PATH = false;
                }
            } else {
                $TEMPLATE_PATH = false;
            }
        }
    } else {
        $TEMPLATE_PATH = false;
    }
    if (!$TEMPLATE_PATH) {
        $TEMPLATE_PATH = QWP_TEMPLATE_ROOT;
        $file_path = QWP_TEMPLATE_ROOT . '/error.php';
        $css_file_path = QWP_TEMPLATE_ROOT . '/error.css';
    }
    if (!file_exists($file_path)) {
        exit($error_description);
    }
    require_once(QWP_TEMPLATE_ROOT . '/common.php');
    qwp_add_common_css_js_code($TEMPLATE_PATH);
    qwp_add_css_code_file($css_file_path);
    require_once($file_path);
}
function qwp_render_no_login_error() {

}
function qwp_render_security_error() {
    $is_login = qwp_is_logined();
    if ($is_login) {
        $txt = L('You do not have the privilege.');
    } else {
        $txt = L('You are not login. Login page is loading, please wait...');
    }
    if (qwp_is_ops_request()) {
        $params = null;
        if (!$is_login) {
            $params = array('toLogin' => qwp_uri_login(true));
        }
        qwp_create_and_echo_json_response(false, $txt, 'error', $params);
    } else {
        if ($is_login) {
            $txt .= L('Goto home page: ') . '<a href="./">' . L('Go to home page') . '</a>';
            qwp_render_error_page($txt);
        } else {
            TO(qwp_uri_login());
        }
    }
}
function qwp_render_system_exception(&$e) {
    $txt = L('Message: ') . $e->getMessage();
    if (IN_DEBUG) {
        $txt .= '<br>' . L('File: ') . substr($e->getFile(), strlen(QWP_ROOT) + 1) . ':' . $e->getLine();
        $txt .= '<br>' . L('Detail: ') . '<br>' . $e->getTraceAsString();
    }
    if (qwp_is_ops_request()) {
        qwp_create_and_echo_json_response(false, $txt);
    } else {
        qwp_render_error_page($txt);
    }
}
function qwp_render_import_ui($name) {
    $file_path = QWP_UI_ROOT . '/' . $name . '.php';
    if (file_exists($file_path)) {
        require_once($file_path);
    }
    qwp_add_js_code(QWP_UI_ROOT . '/' . $name . '.js');
    $file_path = QWP_UI_ROOT . '/' . $name . '.js.php';
    if (file_exists($file_path)) {
        require_once($file_path);
    }
}
function qwp_render_add_loading() {
    qwp_add_js_code(QWP_UI_ROOT . '/loading.js');
}
function qwp_render_add_panel_pager() {
    qwp_add_js_code(QWP_UI_ROOT . '/panel.pager.js');
}
function qwp_render_add_ztree() {
    qwp_include_css_file('zTreeStyle.css');
    qwp_include_js_file('jquery.ztree.all.min.js');
}
function qwp_render_add_list() {
    qwp_add_js_code(QWP_UI_ROOT . '/loading.js');
    qwp_add_js_code(QWP_UI_ROOT . '/list.js');
}
function qwp_render_add_form_code() {
    qwp_render_import_ui('form');
}
function qwp_render_add_search_code() {
    qwp_render_import_ui('search');
}
function qwp_render_import_ui_dialog() {
    qwp_render_import_ui('dialog');
}
function qwp_render_import_ui_table() {
    qwp_render_import_ui('table');
}
function qwp_render_add_form_js($include_validate_ex = false) {
    global $language;

    qwp_include_js_file('jquery.validate.min.js');
    if (isset($language) && $language != 'en') {
        qwp_include_js_file("validate.localization/messages_{$language}.min.js");
    }
    if ($include_validate_ex) {
        qwp_include_js_file('jquery.validate_ex.min.js');
    }
    qwp_include_js_file('jquery.form.min.js');
    qwp_render_add_form_code();
}
function qwp_render_import_form($name, $root = null) {
    global $MODULE_ROOT;

    if (!$root) $root = $MODULE_ROOT;
    require_once(join_paths($root, 'form_' . $name . '.php'));
}
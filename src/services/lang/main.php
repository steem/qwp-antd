<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
if(isset($_COOKIE['language'])){
    $language = $_COOKIE['language'];
}
function qwp_html_lang() {
    global $language;

    $pos = strpos($language, '_');
    if ($pos !== false) {
        return substr($language, 0, $pos);
    }
    return $language;
}
function qwp_add_js_lang($txt) {
    global $js_lang;

    if (is_string($txt)) {
        $js_lang[] = $txt;
    } else if (is_array($txt)){
        $js_lang = array_merge($js_lang, $txt);
    }
}
function qwp_render_js_lang() {
    global $lang_txts;

    echo('<script>var _LANG=' . to_json($lang_txts) . ';</script>');
}
function qwp_try_load_lang_for_module($name, &$lang) {
    global $language;

    if (QWP_MODULE_SEP === '/') {
        if (starts_with($name, '/')) $name = substr($name, 1);
        $name = str_replace('/', '-', $name);
    }
    $lang_file = QWP_LANG_ROOT . '/' . $language . '/' . $name . '.php';
    if (!file_exists($lang_file)) {
        return;
    }
    require_once($lang_file);
}
function qwp_load_all_lang(&$all_lang)
{
    global $language;
    
    $all_lang = array();
    $lang_dir = QWP_LANG_ROOT . '/' . $language;
    $files = scandir($lang_dir);
    if (!$files || count($files) === 2) return;
    $prefix = QWP_MODULE_SEP === '/' ? '/' : '';
    foreach ($files as $file) {
        if (is_dot_dir($file)) continue;
        $lang = null;
        $lang_file = $lang_dir . '/' . $file;
        if (file_exists($lang_file)) {
            require_once($lang_file);
            if ($lang) {
                $file = file_name_without_ext($file);
                if ($file === 'global') $path = '/';
                else $path = $prefix . str_replace('-', '/', $file);
                $all_lang[] = array($path, $lang);
            }
        }
    }
}
function qwp_load_lang_for_module($name) {
    global $lang_txts, $language, $loaded_lang;

    if (isset($loaded_lang[$name])) {
        return;
    }
    $loaded_lang[$name] = true;
    $lang = null;
    qwp_try_load_lang_for_module($name, $lang);
    if ($lang) {
        $lang_txts = array_merge($lang_txts, $lang);
    }
}
function qwp_initialize_language() {
    global $language, $language_set, $lang_txts, $loaded_lang;
    $loaded_lang = array();
    $lang_txts = array();
    // initialize language set
    if (!isset($language_set)) {
        $language_set = C('lang_set');
    }
    if (!$language_set) {
        $set = scandir(QWP_LANG_ROOT);
        $language_set = array();
        foreach ($set as &$name) {
            if (!is_dot_dir($name) && $name != 'main.php') {
                $language_set[$name] = true;
            }
        }
        _C('lang_set', $language_set);
    }
    if (!isset($language) || !isset($language_set[$language])) {
        $language = C('lang');
        if (!$language) {
            $language = DEFAULT_LANGUAGE;
        }
    }
}
function qwp_get_lang_text($t) {
    global $lang_txts, $MODULE, $MODULE_URI;

    if (isset($lang_txts[$t])) {
        return $lang_txts[$t];
    }
    qwp_load_lang_for_module($MODULE_URI);
    if (isset($lang_txts[$t])) {
        return $lang_txts[$t];
    }
    if (count($MODULE) > 0) {
        qwp_load_lang_for_module($MODULE[0]);
        if (isset($lang_txts[$t])) {
            return $lang_txts[$t];
        }
    }
    qwp_load_lang_for_module('global');
    if (isset($lang_txts[$t])) {
        return $lang_txts[$t];
    }
    qwp_load_lang_for_module('system');
    return isset($lang_txts[$t]) ? $lang_txts[$t] : $t;
}
function L($t) {
    $cnt = func_num_args();
    if (!$cnt) {
        return '';
    }
    $t = qwp_get_lang_text($t);
    if ($cnt == 1) {
        return $t;
    }
    $args = func_get_args();
    for ($i = 1; $i < $cnt; ++$i) {
        $idx = $i - 1;
        $t = str_replace('{' . $idx . '}', $args[$i], $t);
    }
    return $t;
}
function EL($t) {
    $args = func_get_args();
    echo(call_user_func_array('L', $args));
}
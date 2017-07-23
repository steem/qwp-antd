<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
define('QWP_OBJ_OPS', "__ops__");
define('QWP_TP_TEXT_PLAIN', 'text/plain');
define('QWP_TP_JSON', 'application/json');
define('QWP_TP_VOICE', 'audio/x-wav');
define('QWP_TP_XML', 'text/xml');
define('QWP_TP_HTML', 'text/html');

// request related functions
function TO($url) {
    header("Location: $url");
    exit();
}
function initialize_request() {
    global $MODULE, $PAGE, $OP, $F, $S;

    $MODULE = P('m');
    $PAGE = P('p');
    $OP = P('op');
    $F = P('f', array());
    $S = P('s', array());
}
// get data form $_GET or $_POST or $src_arr
function P($name, $default = null, &$src_arr = null) {
    if ($src_arr && isset($src_arr[$name])) {
        return $src_arr[$name];
    }

    global $_GET, $_POST;

    if (isset($_POST[$name])) {
        return $_POST[$name];
    }
    if (isset($_GET[$name])) {
        return $_GET[$name];
    }
    return $default;
}
function F($name, $default = null) {
    global $F;

    return isset($F[$name]) ? $F[$name] : $default;
}
function S($name, $default = null) {
    global $S;

    return isset($S[$name]) ? $S[$name] : $default;
}
function C($name, $default = null) {
    global $_SESSION;

    $name = QWP_SESSION_PREFIX . $name;
    return isset($_SESSION[$name]) ? $_SESSION[$name] : $default;
}
function _C($name, &$new_value = null) {
    global $_SESSION;

    $name = QWP_SESSION_PREFIX . $name;
    if ($new_value === null) {
        unset($_SESSION[$name]);
    } else {
        $_SESSION[$name] = $new_value;;
    }
}
function get_query_string() {
    global $_SERVER;

    if (isset($_SERVER["QUERY_STRING"])) {
        return $_SERVER["QUERY_STRING"];
    }
    return "";
}
function get_joined_digits(&$v, &$ids) {
    $ids = explode(',', $v);
    if (count($ids) === 0) {
        return false;
    }
    foreach ($ids as $id) {
        if (!is_digits($id)) {
            return false;
        }
    }
    return true;
}
function array_to_query_string(&$arr) {
    $sep = '';
    $p = '';
    foreach ($arr as $k => &$v) {
        $p .= $sep . $k . '=' . urlencode($v);
        $sep = '&';
    }
    return $p;
}
function file_extension_to_type($ext) {
    $ext = strtolower($ext);
    $ext2type = array(
        'image' => array('jpg', 'jpeg', 'jpe', 'gif', 'png', 'bmp', 'tif', 'tiff', 'ico'),
        'audio' => array('aac', 'ac3', 'aif', 'aiff', 'm3a', 'm4a', 'm4b', 'mka', 'mp1', 'mp2', 'mp3', 'ogg', 'oga', 'ram', 'wav', 'wma'),
        'video' => array('3g2', '3gp', '3gpp', 'asf', 'avi', 'divx', 'dv', 'flv', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'mpv', 'ogm', 'ogv', 'qt', 'rm', 'vob', 'wmv'),
        'document' => array('doc', 'docx', 'docm', 'dotm', 'odt', 'pages', 'pdf', 'xps', 'oxps', 'rtf', 'wp', 'wpd'),
        'spreadsheet' => array('numbers', 'ods', 'xls', 'xlsx', 'xlsm', 'xlsb'),
        'interactive' => array('swf', 'key', 'ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'ppsm', 'sldx', 'sldm', 'odp'),
        'text' => array('asc', 'csv', 'tsv', 'txt'),
        'archive' => array('bz2', 'cab', 'dmg', 'gz', 'rar', 'sea', 'sit', 'sqx', 'tar', 'tgz', 'zip', '7z'),
        'code' => array('css', 'htm', 'html', 'php', 'js'),
    );
    foreach ($ext2type as $type => &$exts)
        if (in_array($ext, $exts))
            return $type;
    return null;
}
function get_mime_types() {
    return array(
        // Image formats.
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpe' => 'image/jpeg',
        'gif' => 'image/gif',
        'png' => 'image/png',
        'bmp' => 'image/bmp',
        'tif' => 'image/tiff',
        'tiff' => 'image/tiff',
        'ico' => 'image/x-icon',
        // Video formats.
        'asf' => 'video/x-ms-asf',
        'asx' => 'video/x-ms-asf',
        'wmv' => 'video/x-ms-wmv',
        'wmx' => 'video/x-ms-wmx',
        'wm' => 'video/x-ms-wm',
        'avi' => 'video/avi',
        'divx' => 'video/divx',
        'flv' => 'video/x-flv',
        'mov' => 'video/quicktime',
        'qt' => 'video/quicktime',
        'mpeg' => 'video/mpeg',
        'mpg' => 'video/mpeg',
        'mpe' => 'video/mpeg',
        'mp4' => 'video/mp4',
        'm4v' => 'video/mp4',
        'ogv' => 'video/ogg',
        'webm' => 'video/webm',
        'mkv' => 'video/x-matroska',
        '3gp' => 'video/3gpp', // Can also be audio
        '3gpp' => 'video/3gpp', // Can also be audio
        '3g2' => 'video/3gpp2', // Can also be audio
        '3gp2' => 'video/3gpp2', // Can also be audio
        // Text formats.
        'txt' => 'text/plain',
        'asc' => 'text/plain',
        'c' => 'text/plain',
        'cc' => 'text/plain',
        'h' => 'text/plain',
        'srt' => 'text/plain',
        'csv' => 'text/csv',
        'tsv' => 'text/tab-separated-values',
        'ics' => 'text/calendar',
        'rtx' => 'text/richtext',
        'css' => 'text/css',
        'htm' => 'text/html',
        'html' => 'text/html',
        'vtt' => 'text/vtt',
        'dfxp' => 'application/ttaf+xml',
        // Audio formats.
        'mp3' => 'audio/mpeg',
        'm4a' => 'audio/mpeg',
        'm4b' => 'audio/mpeg',
        'ra' => 'audio/x-realaudio',
        'ram' => 'audio/x-realaudio',
        'wav' => 'audio/wav',
        'ogg' => 'audio/ogg',
        'oga' => 'audio/ogg',
        'mid' => 'audio/midi',
        'midi' => 'audio/midi',
        'wma' => 'audio/x-ms-wma',
        'wax' => 'audio/x-ms-wax',
        'mka' => 'audio/x-matroska',
        // Misc application formats.
        'rtf' => 'application/rtf',
        'js' => 'application/javascript',
        'pdf' => 'application/pdf',
        'swf' => 'application/x-shockwave-flash',
        'class' => 'application/java',
        'tar' => 'application/x-tar',
        'zip' => 'application/zip',
        'gz' => 'application/x-gzip',
        'gzip' => 'application/x-gzip',
        'rar' => 'application/rar',
        '7z' => 'application/x-7z-compressed',
        'exe' => 'application/x-msdownload',
        // MS Office formats.
        'doc' => 'application/msword',
        'pot' => 'application/vnd.ms-powerpoint',
        'pps' => 'application/vnd.ms-powerpoint',
        'ppt' => 'application/vnd.ms-powerpoint',
        'wri' => 'application/vnd.ms-write',
        'xla' => 'application/vnd.ms-excel',
        'xls' => 'application/vnd.ms-excel',
        'xlt' => 'application/vnd.ms-excel',
        'xlw' => 'application/vnd.ms-excel',
        'mdb' => 'application/vnd.ms-access',
        'mpp' => 'application/vnd.ms-project',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'docm' => 'application/vnd.ms-word.document.macroEnabled.12',
        'dotx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'dotm' => 'application/vnd.ms-word.template.macroEnabled.12',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xlsm' => 'application/vnd.ms-excel.sheet.macroEnabled.12',
        'xlsb' => 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'xltx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'xltm' => 'application/vnd.ms-excel.template.macroEnabled.12',
        'xlam' => 'application/vnd.ms-excel.addin.macroEnabled.12',
        'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'pptm' => 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'ppsx' => 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'ppsm' => 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
        'potx' => 'application/vnd.openxmlformats-officedocument.presentationml.template',
        'potm' => 'application/vnd.ms-powerpoint.template.macroEnabled.12',
        'ppam' => 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        'sldx' => 'application/vnd.openxmlformats-officedocument.presentationml.slide',
        'sldm' => 'application/vnd.ms-powerpoint.slide.macroEnabled.12',
        'onetoc' => 'application/onenote',
        'onetoc2' => 'application/onenote',
        'onetmp' => 'application/onenote',
        'onepkg' => 'application/onenote',
        'oxps' => 'application/oxps',
        'xps' => 'application/vnd.ms-xpsdocument',
        // OpenOffice formats.
        'odt' => 'application/vnd.oasis.opendocument.text',
        'odp' => 'application/vnd.oasis.opendocument.presentation',
        'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        'odg' => 'application/vnd.oasis.opendocument.graphics',
        'odc' => 'application/vnd.oasis.opendocument.chart',
        'odb' => 'application/vnd.oasis.opendocument.database',
        'odf' => 'application/vnd.oasis.opendocument.formula',
        // WordPerfect formats.
        'wp' => 'application/wordperfect',
        'wpd' => 'application/wordperfect',
        // iWork formats.
        'key' => 'application/vnd.apple.keynote',
        'numbers' => 'application/vnd.apple.numbers',
        'pages' => 'application/vnd.apple.pages',
    );
}
function no_cache() {
    // no cache
    header('Expires: 0');
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
}
function req_not_found() {
    header("HTTP/1.1 404 Not Found");
}
function set_content_type($content_type = 'text/plain', $is_image = false) {
    if ($is_image) {
        header("Content-type: $content_type");
    } else {
        header("Content-type: $content_type;charset=" . CONTENT_CHARSET);
    }
}
function download_file($file_path, $file_name, $content_type = "application/x-download", $attachment = true) {
    if (file_exists($file_path)) {
        $file_size = filesize($file_path);
        header('Content-Description: File Transfer');
        header("Content-type: " . $content_type);
        header("Content-Transfer-Encoding: Binary");
        no_cache();
        header('Pragma: public');
        if ($attachment) {
            header('Content-Disposition: attachment; filename=' . $file_name);
        }
        header('Content-length: ' . $file_size);
        readfile($file_path);
    } else {
        req_not_found();
    }
}
function set_output_file($file_name, $content_type = "application/x-download", $attachment = true, $file_size = 0) {
    header('Content-Description: File Transfer');
    header("Content-type: " . $content_type);
    header("Content-Transfer-Encoding: Binary");
    no_cache();
    header('Pragma: public');
    if ($attachment) {
        header('Content-Disposition: attachment; filename=' . $file_name);
    }
    if ($file_size) header('Content-length: ' . $file_size);
}
// db related functions
function encode_slash($data) {
    if (!isset($data)) {
        return "";
    }
    if (get_magic_quotes_gpc()) {
        $data = stripslashes($data);
    }
    return $data;
}
function encode_array_slash(&$arr) {
    if (!is_array($arr)) {
        $arr = encode_slash($arr);
        return;
    }
    foreach ($arr as $key => &$item) {
        $item = encode_slash($item);
    }
}
function safe_html($string, $length = null) {
    $string = trim_ex($string);
    $string = utf8_decode($string);
    $string = htmlentities($string, ENT_NOQUOTES);
    $string = str_replace("#", "&#35;", $string);
    $string = str_replace("%", "&#37;", $string);
    if ($length) $string = substr($string, 0, $length);
    return $string;
}
function unset_data(&$data, $key) {
    if (!is_array($key)) {
        $key = array($key);
    }
    foreach ($key as $item) {
        if (isset($data[$item])) {
            unset($data[$item]);
        }
    }
}
// charset related functions
function change_charset($data, $from, $to) {
    if ($data) {
        return iconv($from, $to, $data);
    }
    return $data;
}
function change_array_charset(&$data, $from, $to) {
    foreach ($data as $key => &$item) {
        if (!is_array($item)) {
            $data[$key] = change_charset($from, $to, $data);
        }
    }
}
// file related functions
function txt_file_to_array($file_path, $sep = "\n") {
    if (!file_exists($file_path)) {
        return null;
    }
    $content = @file_get_contents($file_path);
    $items = explode($sep, $content);
    $ret = array();
    foreach ($items as $item) {
        $item = trim($item);
        if (!empty($item)) {
            $ret[] = $item;
        }
    }
    return count($ret) > 0 ? $ret : null;
}
function txt_file_to_map($file_path, $sep = "\n", $key_sep = '=')
{
    if (!file_exists($file_path))
    {
        return null;
    }
    $content = @file_get_contents($file_path);
    $items = explode($sep, $content);
    $ret = array();
    foreach ($items as $item)
    {
        $item = trim($item);
        if (empty($item))
        {
            continue;
        }
        $pos = strpos($item, $key_sep);
        if ($pos !== false) {
            $key = substr($item, 0, $pos);
            $key = trim($key);
            $ret[$key] = trim(substr($item, $pos + 1));
        }
    }
    return count($ret) > 0 ? $ret : null;
}
function is_dot_dir(&$dir) {
    return $dir == '.' || $dir == '..';
}
function xcopy($src, $dst) {
    if (is_dir($src)) {
        if (!file_exists($dst)) {
            @mkdir($dst);
        }
    }
    $src = realpath($src);
    $dst = realpath($dst);
    if (is_windows()) {
        system("xcopy /e /y $src\\* $dst");
    } else {
        system("scp -r $src/* $dst");
    }
}
function copy_files($src, $dst, $files) {
    foreach ($files as $file) {
        $src_file = join_paths($src, $file);
        if (file_exists($src_file)) {
            @copy($src_file, join_paths($dst, $file));
        }
    }
}
function copy_files_with_prefix($src, $dst, $prefix) {
    $files = scandir($src);
    foreach ($files as $file) {
        if (is_dot_dir($file) || !starts_with($file, $prefix)) {
            continue;
        }
        $src_file = join_paths($src, $file);
        if (file_exists($src_file)) {
            @copy($src_file, join_paths($dst, $file));
        }
    }
}
function copy_files_with_suffix($src, $dst, $suffix) {
    $files = scandir($src);
    foreach ($files as $file) {
        if (is_dot_dir($file) || !ends_with($file, $suffix)) {
            continue;
        }
        $src_file = join_paths($src, $file);
        if (file_exists($src_file)) {
            @copy($src_file, join_paths($dst, $file));
        }
    }
}
function rename_files_with_prefix($src, $dst, $prefix) {
    $files = scandir($src);
    foreach ($files as $file) {
        if (is_dot_dir($file) || !starts_with($file, $prefix)) {
            continue;
        }
        $src_file = join_paths($src, $file);
        if (file_exists($src_file)) {
            @rename($src_file, join_paths($dst, $file));
        }
    }
}
function rename_files_with_suffix($src, $dst, $suffix) {
    $files = scandir($src);
    foreach ($files as $file) {
        if (is_dot_dir($file) || !ends_with($file, $suffix)) {
            continue;
        }
        $src_file = join_paths($src, $file);
        if (file_exists($src_file)) {
            @rename($src_file, join_paths($dst, $file));
        }
    }
}
function all_file_exists($files) {
    foreach ($files as &$item) {
        if (!file_exists($item)) {
            return false;
        }
    }
    return true;
}
function create_dirs($dirs) {
    if (!$dirs) {
        return;
    }
    foreach ($dirs as $dir) {
        @mkdir($dir);
    }
}
function dir_size($dir) {
    $handle = opendir($dir);
    $size = 0;
    while (false !== ($file = readdir($handle))) {
        if (is_dot_dir($file)) continue;
        if (is_dir("$dir/$file")) {
            $size += dir_size("$dir/$file");
        } else {
            $size += filesize("$dir/$file");
        }
    }
    closedir($handle);
    return $size;
}
function file_ext($name) {
    $pos = strrpos($name, '.');
    return $pos === false ? '' : substr($name, $pos + 1);
}
function file_name_without_ext($name) {
    $pos = strrpos($name, '.');
    return $pos === false ? $name : substr($name, 0, $pos);
}
function echo_line($msg) {
    echo($msg);
    echo("\n");
}
function echo_file($file) {
    if (file_exists($file)) {
        $fp = fopen($file, "rb");
        fpassthru($fp);
        fclose($fp);
    }
}
function echo_js_file($file) {
    if (file_exists($file)) {
        echo('<script>');
        $fp = fopen($file, "rb");
        fpassthru($fp);
        fclose($fp);
        echo('</script>');
    }
}
function join_paths() {
    $args = func_get_args();
    $paths = array();
    foreach ($args as $arg) {
        $paths = array_merge($paths, (array)$arg);
    }
    return is_windows() ? join("\\", $paths) : join('/', $paths);
}
// date & time related functions
function get_day_start($t = 0) {
    if ($t === 0) {
        $t = time();
    }
    $h = 0;
    $minute = 0;
    $s = 0;
    $y = intval(@date("Y", $t));
    $m = intval(@date("m", $t));
    $d = intval(@date("d", $t));
    return @mktime($h, $minute, $s, $m, $d, $y);
}
function get_next_day_time($t = 0, $offset = 0) {
    if ($t === 0) {
        $t = time();
    }
    $h = intval(@date("H", $t));
    $minute = intval(@date("i", $t));
    $s = intval(@date("s", $t));
    $y = intval(@date("Y", $t));
    $m = intval(@date("m", $t));
    $d = intval(@date("d", $t)) + $offset;
    return @mktime($h, $minute, $s, $m, $d, $y);
}
function get_datetime($t = 0, $format = "Y-m-d H:i:s") {
    return @date($format, $t == 0 ? time() : $t);
}
function get_datetime_string($t) {
    if (empty($t)) {
        return '--';
    }
    return @date("Y/m/d H:i:s", $t);
}
if (!function_exists('date_parse_from_format')) {
    function date_parse_from_format($format, $date) {
        // reverse engineer date formats
        $keys = array(
            'Y' => array('year', '\d{4}'),
            'y' => array('year', '\d{2}'),
            'm' => array('month', '\d{2}'),
            'n' => array('month', '\d{1,2}'),
            'M' => array('month', '[A-Z][a-z]{3}'),
            'F' => array('month', '[A-Z][a-z]{2,8}'),
            'd' => array('day', '\d{2}'),
            'j' => array('day', '\d{1,2}'),
            'D' => array('day', '[A-Z][a-z]{2}'),
            'l' => array('day', '[A-Z][a-z]{6,9}'),
            'u' => array('hour', '\d{1,6}'),
            'h' => array('hour', '\d{2}'),
            'H' => array('hour', '\d{2}'),
            'g' => array('hour', '\d{1,2}'),
            'G' => array('hour', '\d{1,2}'),
            'i' => array('minute', '\d{2}'),
            's' => array('second', '\d{2}')
        );

        // convert format string to regex
        $regex = '';
        $chars = str_split($format);
        foreach ($chars AS $n => $char) {
            $lastChar = isset($chars[$n - 1]) ? $chars[$n - 1] : '';
            $skipCurrent = '\\' == $lastChar;
            if (!$skipCurrent && isset($keys[$char])) {
                $regex .= '(?P<' . $keys[$char][0] . '>' . $keys[$char][1] . ')';
            } else if ('\\' == $char) {
                $regex .= $char;
            } else {
                $regex .= preg_quote($char);
            }
        }

        $dt = array();
        $dt['error_count'] = 0;
        // now try to match it
        if (preg_match('#^' . $regex . '$#', $date, $dt)) {
            foreach ($dt AS $k => $v) {
                if (is_int($k)) {
                    unset($dt[$k]);
                }
            }
            if (!checkdate($dt['month'], $dt['day'], $dt['year'])) {
                $dt['error_count'] = 1;
            }
        } else {
            $dt['error_count'] = 1;
        }
        $dt['errors'] = array();
        $dt['fraction'] = '';
        $dt['warning_count'] = 0;
        $dt['warnings'] = array();
        $dt['is_localtime'] = 0;
        $dt['zone_type'] = 0;
        $dt['zone'] = 0;
        $dt['is_dst'] = '';
        return $dt;
    }
}
function datetime_to_int($timestamp, $format = 'Y-m-d H:i:s') {
    $ret = @date_parse_from_format($format, $timestamp);
    if ($ret['year'] === false || $ret['month'] === false || $ret['day'] === false ||
        $ret['hour'] === false || $ret['minute'] === false || $ret['second'] === false) {
        return 0;
    }
    return @mktime($ret['hour'], $ret['minute'], $ret['second'], $ret['month'], $ret['day'], $ret['year']);
}
function date_to_int($timestamp, $format = 'Y-m-d') {
    $ret = @date_parse_from_format($format, $timestamp);
    if ($ret['year'] === false || $ret['month'] === false || $ret['day'] === false) {
        return 0;
    }
    return @mktime(0, 0, 0, $ret['month'], $ret['day'], $ret['year']);
}
function xls_time_to_int($t) {
    return @mktime(0, 0, 0, 1, intval($t) - 1, 1900);
}
function get_date($t = 0, $offset = 0, $sep = '/') {
    $format = 'Y' . $sep . 'm' . $sep . 'd';
    if ($offset === 0) {
        return @date($format, $t == 0 ? time() : $t);
    }
    get_sep_date($year, $month, $day);
    $aDay = $day + $offset;
    return @date($format, mktime(0, 0, 0, $month, $aDay, $year));
}
function format_date_range(&$set, $field) {
    if (!isset($set[$field])) {
        return;
    }
    if (empty($set[$field])) {
        unset($set[$field]);
    } else {
        $date_range = explode('-', $set[$field]);
        unset($set[$field]);
        if (count($date_range) == 2) {
            $date_range[0] = trim($date_range[0]) . ' 00:00:00';
            $date_range[1] = trim($date_range[1]) . ' 23:59:59';
            $set[$field] = $date_range;
        }
    }
}
function format_date_range_int(&$set, $field) {
    if (!isset($set[$field])) {
        return;
    }
    if (empty($set[$field])) {
        unset($set[$field]);
    } else {
        $date_range = explode('-', $set[$field]);
        unset($set[$field]);
        if (count($date_range) == 2) {
            $start = explode('/', $date_range[0]);
            $end = explode('/', $date_range[0]);
            $date_range[0] = mktime(0, 0, 0, $start[1], $start[2], $start[0]);
            $date_range[1] = mktime(23, 59, 59, $end[1], $end[2], $end[0]);
            $set[$field] = $date_range;
        }
    }
}
function get_year() {
    return @date("Y");
}
function get_month() {
    return @date("m");
}
function get_day() {
    return @date("d");
}
function get_hour() {
    return @date("H");
}
function get_minute()
{
    return @date("i");
}
function get_second() {
    return @date("s");
}
function get_week_day() {
    $d = @getdate();
    return $d["wday"];
}
function is_weekend() {
    $wday = get_week_day();
    return $wday == 0 || $wday == 6;
}
function get_sep_date(&$y, &$m, &$d, $t = 0) {
    if ($t === 0) {
        $t = time();
    }
    $y = intval(@date("Y", $t));
    $m = intval(@date("m", $t));
    $d = intval(@date("d", $t));
}
function get_last_days(&$date, $nums) {
    $year = 0;
    $month = 0;
    $day = 0;
    get_sep_date($year, $month, $day);
    for ($i = $nums - 1; $i >= 0; --$i) {
        $aDay = $day - $i;
        $t = mktime(0, 0, 0, $month, $aDay, $year);
        $d = array();
        $d['day'] = get_date($t);
        $d['range'] = array(get_datetime($t), get_datetime(mktime(23, 59, 59, $month, $aDay, $year)));
        $date[] = $d;
    }
}
// data related functions
function remove_empty_in_map(&$arr) {
    $empties = array();
    foreach ($arr as $k => $v) {
        if (empty($v)) {
            $empties[] = $k;
        }
    }
    foreach ($empties as $k) {
        unset($arr[$k]);
    }
}
function to_json($arr) {
    $tmp = json_encode($arr);
    return str_replace("\\/", "/", $tmp);
}
function echo_json($arr) {
    $jsonp = P('callback');
    if ($jsonp) echo("$jsonp(");
    echo(to_json($arr));
    if ($jsonp) echo(")");
}
function json_from_string($data, $default = null) {
    if (!$data) {
        return $default;
    }
    $data = json_decode($data, true);
    if (!$data) {
        return $default;
    }
    return $data;
}
function json_from_file($file_path, $default = null) {
    if (file_exists($file_path)) {
        try {
            $data = file_get_contents($file_path);
            $data = json_decode($data, true);
            if (!$data) {
                return $default === null ? array() : $default;
            }
            return $data;
        } catch (Exception $e) {

        }
    }
    return $default === null ? array() : $default;
}
function to_json_file($arr, $file_path) {
    return @file_put_contents($file_path, to_json($arr));
}
function to_base64_file($file_path, $content) {
    return @file_put_contents($file_path, base64_encode($content)) > 0;
}
function base64_from_file($file_path) {
    if (!file_exists($file_path)) {
        return '';
    }
    return base64_encode(file_get_contents($file_path));
}
function copy_from(&$target, $from) {
    foreach ($from as $k => $v) {
        $target[$k] = $v;
    }
}
function copy_from_ex(&$target, &$from) {
    foreach ($from as $k => $v) {
        $target[$k] = $v;
    }
}
// string related functions
// string format function like c# string.format
function format($f) {
    $cnt = func_num_args();
    if (!$cnt) {
        return '';
    }
    if ($cnt == 1) {
        return $f;
    }
    $args = func_get_args();
    for ($i = 1; $i < $cnt; ++$i) {
        $idx = $i - 1;
        $f = str_replace('{' . $idx . '}', $args[$i], $f);
    }
    return $f;
}
function camel_case($s) {
    if (!$s) {
        return $s;
    }
    return strtoupper(substr($s, 0, 1)) . substr($s, 1);
}
function merge_spaces($str) {
    while (strpos($str, '  ') !== false) {
        $str = str_replace("  ", " ", $str);
    }
    while (strpos($str, "\xc2\xa0") !== false) {
        $str = str_replace("\xc2\xa0", "", $str);
    }
    while (strpos($str, "\x5c\x0a") !== false) {
        $str = str_replace("\x5c\x0a", "\x0a", $str);
    }
    $str = str_replace("\xe2\x80\x99", "'", $str);
    $str = str_replace("\xe2\x80\x98", "'", $str);
    return $str;
}
function remove_4bytes_utf8($str) {
    return preg_replace('/[\xF0-\xF7].../', '', $str);
}
function trim_all_spaces($str) {
    $str = remove_4bytes_utf8($str);
    return preg_replace(array('/\s/', '/\xC2\xA0/'), '', $str);
}
function trim_ex(&$str) {
    $str = trim($str);
    $str = trim($str, "\xC2\xA0");
}
function trim_array(&$arr, $trims = null)
{
    if ($trims)
    {
        foreach ($arr as &$item)
        {
            $item = trim($item, $trims);
        }
    }
    else
    {
        foreach ($arr as &$item)
        {
            $item = trim($item);
        }
    }
}
function random_string() {
    return md5(uniqid('', true) . time());
}
function starts_with($haystack, $needle) {
    return substr($haystack, 0, strlen($needle)) === $needle;
}
function ends_with($haystack, $needle) {
    return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
}
function str_to_int_array($str, $delimiter) {
    if (empty($str)) {
        return array();
    }
    $arr = explode($delimiter, $str);
    $ret = array();
    foreach ($arr as $item) {
        if (preg_match("/^\d+$/", $item)) {
            $ret[] = intval($item);
        }
    }
    return $ret;
}
function rc4($pwd, $data) {
    $key[] = "";
    $box[] = "";
    $cipher = "";
    $pwd_length = strlen($pwd);
    $data_length = strlen($data);

    for ($i = 0; $i < 256; $i++) {
        $key[$i] = ord($pwd[$i % $pwd_length]);
        $box[$i] = $i;
    }

    for ($j = $i = 0; $i < 256; $i++) {
        $j = ($j + $box[$i] + $key[$i]) % 256;
        $tmp = $box[$i];
        $box[$i] = $box[$j];
        $box[$j] = $tmp;
    }

    for ($a = $j = $i = 0; $i < $data_length; $i++) {
        $a = ($a + 1) % 256;
        $j = ($j + $box[$a]) % 256;

        $tmp = $box[$a];
        $box[$a] = $box[$j];
        $box[$j] = $tmp;

        $k = $box[(($box[$a] + $box[$j]) % 256)];
        $cipher .= chr(ord($data[$i]) ^ $k);
    }
    return $cipher;
}
function encrypt_data($data, $key) {
    $req = array(
        'data' => $data,
        't' => time(),
    );
    return array('data' => bin2hex(rc4($key, to_json($req))), 'enc' => true);
}
function decrypt_data($data, $key) {
    $data = rc4($key, hex2bin($data));
    $data = json_from_string($data);
    if (!$data) {
        return false;
    }
    if (!isset($data['data']) || empty($data['data'])) {
        return false;
    }
    return $data['data'];
}
function remove_unwanted_data(&$data, $wanted, $unwanted = null, $convert = false) {
    if ($convert) {
        $f1 = array();
        if ($wanted) {
            foreach ($wanted as $i) {
                $f1[$i] = 1;
            }
            $wanted = $f1;
        }
        $f1 = array();
        if ($unwanted) {
            foreach ($unwanted as $i) {
                $f1[$i] = 1;
            }
            $unwanted = $f1;
        }
    }
    foreach ($data as $k => &$v) {
        if (($wanted && !isset($wanted[$k])) || ($unwanted && isset($unwanted[$k]))) {
            unset($data[$k]);
        }
    }
}
function copy_data_from_array(&$dst, &$src, $wanted, $check_empty = false) {
    foreach ($src as $k => &$v) {
        if (isset($wanted[$k]) && (!$check_empty || !empty($v))) {
            $dst[$k] = $v;
        }
    }
}
function column_of_array(&$src, $key, &$dst) {
    $dst = array();
    foreach ($src as &$item) {
        if (isset($item[$key])) $dst[] = $item[$key];
    }
}
// os related functions
function is_windows() {
    global $is_windows;

    if (!isset($is_windows)) {
        $is_windows = 'WINNT' == PHP_OS || 'WIN32' == PHP_OS;
    }
    return $is_windows;
}

// http related functions
function http_post($url, $data, $timeout = 180) {
    if (is_array($data)) {
        $data = http_build_query($data);
    }
    $opts = array(
        'http' => array(
            'method' => 'POST',
            'timeout' => $timeout,
            'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                "Content-Length: " . strlen($data) . "\r\n",
            'content' => $data
        )
    );
    $context = stream_context_create($opts);
    return @file_get_contents($url, false, $context);
}
function http_post_file($url, $file_path, $name, $file_name, $content_type, $headers, $boundary) {
    copy_from($headers, array(
        "Expect" => "100-continue",
        'Accept-Language' => 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
    ));
    $body = implode("\r\n", array(
        "",
        $boundary,
        "Content-Disposition: form-data; name=\"{$name}\"; filename=\"{$file_name}\"",
        "Content-Type: $content_type",
        "",
        file_get_contents($file_path),
        $boundary,
    ));
    $header_string = array();
    $header_string[] = 'Content-Length: ' . strlen($body);
    $user_agent = '';
    $cookies = '';
    foreach ($headers as $k => $v) {
        if ($k == 'User-Agent') {
            $user_agent = $v;
        } else if ($k == 'Cookie') {
            $cookies = $v;
        } else {
            $header_string[] = $k . ': ' . $v;
        }
    }
    $process = curl_init();
    curl_setopt($process, CURLOPT_URL, $url);
    curl_setopt($process, CURLOPT_HTTPHEADER, $header_string);
    curl_setopt($process, CURLOPT_HEADER, 0);
    if ($user_agent) {
        curl_setopt($process, CURLOPT_USERAGENT, $user_agent);
    }
    if ($cookies) {
        curl_setopt($process, CURLOPT_COOKIE, $cookies);
    }
    curl_setopt($process, CURLOPT_TIMEOUT, 50);
    curl_setopt($process, CURLOPT_POSTFIELDS, array(
        "tmp" => "@$file_path"
    ));
    $return = curl_exec($process);
    curl_close($process);
    return $return;
}
function http_get($url, $data) {
    if (is_array($data)) {
        $data = http_build_query($data);
    }
    if (strpos($url, '?')) {
        $url .= '&' . $data;
    } else {
        $url .= '?' . $data;
    }
    return @file_get_contents($url);
}
function get_remote_client_address() {
    if (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
        $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    } else if (isset($_SERVER["HTTP_CLIENT_IP"])) {
        $ip = $_SERVER["HTTP_CLIENT_IP"];
    } else {
        $ip = $_SERVER["REMOTE_ADDR"];
    }
    if ($ip == '::1') {
        $ip = '127.0.0.1';
    }
    return $ip;
}
function write_key_to_csv_file(&$data, $filePath, $sep = ',') {
    $ids = "";
    foreach ($data as $k => $v) {
        $ids .= $k . $sep;
    }
    file_put_contents($filePath, $ids);
}
function write_string_array_to_csv_file(&$data, $filePath, $sep = ',') {
    file_put_contents(implode($sep, $data), $filePath);
}
function load_csv_to_key_map($filePath, $sep = ',') {
    if (!file_exists($filePath)) {
        return array();
    }
    $ids = array();
    $arr = explode($sep, @file_get_contents($filePath));
    for ($i = 0; $i < count($arr); ++$i) {
        $arr[$i] = trim($arr[$i]);
        if (empty($arr[$i])) {
            continue;
        }
        $ids[$arr[$i]] = true;
    }
    return $ids;
}
function str_add_quot($v) {
    return "'" . $v . "'";
}
function array_to_string(&$arr) {
    return "('" . implode("','", $arr) . "')";
}
function join_array_key(&$arr, $sep = ';') {
    if (!is_array($arr)) {
        return '';
    }
    $ret = '';
    $is_sep = '';
    foreach ($arr as $k => $v) {
        $ret .= $is_sep . $k;
        if (!$is_sep) {
            $is_sep = $sep;
        }
    }
    return $ret;
}
function array_append(&$arr, &$new_data)
{
    foreach ($new_data as &$item) {
        $arr[] = $item;
    }
}
// validate functions
function is_one_key_empty(&$arr, $keys)
{
    if (is_string($keys))
    {
        $keys = array($keys);
    }
    foreach ($keys as $key)
    {
        if (!isset($arr[$key]) || !$arr[$key])
        {
            return true;
        }
    }
    return false;
}
function get_input_rules($k = null) {
    $rules = array(
        'digits' => "^\\d+$",
        'letters' => "^([a-z]|[A-Z])+$",
        'alphanumeric' => "^[\\w|-]+$",
        'alphanumeric_ex' => "^[\\w|-|\\.]+$",
        // Copyright (c) 2010-2013 Diego Perini, MIT licensed
        // https://gist.github.com/dperini/729294
        // see also https://mathiasbynens.be/demo/url-regex
        // modified to allow protocol-relative URLs
        'url' => array('^(https?|ftp):\/\/[^\s\/\$.?#].[^\s]*$', 'i'),
        'password' => array(array("^(\\w|\\d|@|!)+$", "\\d", "[a-z]", "[A-Z]"), array('', '', 'i', 'i')),
        // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
        // Retrieved 2014-01-14
        // If you have a problem with this implementation, report a bug against the above spec
        // Or use custom methods to implement your own email validation
        'email' => "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        'number' => "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
        'ipv4' => "^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
        'ipv6' => "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
        'datehour' => "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d$",
        'datetime' => "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d$",
        'date' => "^\\d\\d\\d\\d-\\d\\d-\\d\\d$",
        'joined_digits' => "^\\d+[\\d|,]*$",
        'base64' => '^[A-Za-z0-9\\+\\/=]+$',
        'hex' => '^[A-E0-9]+$',
    );
    return $k ? (isset($rules[$k]) ? $rules[$k] : false): $rules;
}
function is_valid_input($v, $rule_name, &$rules = null) {
    if (!$rules) {
        $statement = get_input_rules($rule_name);
    } else {
        $statement = isset($rules[$rule_name]) ? $rules[$rule_name] : false;
    }
    if (!$statement) {
        return -1;
    }
    if (is_string($statement)) {
        return preg_match("/" . $statement . "/", $v);
    }
    if (is_string($statement[0])) {
        return preg_match("/" . $statement[0] . "/" . $statement[1], $v);
    }
    for ($i = 0; $i < count($statement[0]); ++$i) {
        if (!preg_match("/" . $statement[0][$i] . "/" . $statement[1][$i], $v)) {
            return false;
        }
    }
    return true;
}
function is_datetime($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('datetime');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_datehour($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('datehour');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_date($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('date');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_digits($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('digits');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_joined_digits($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('joined_digits');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_letters($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('letters');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_alphanumeric($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('alphanumeric');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_alphanumeric_ex($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('alphanumeric_ex');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_url($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('url');
    }
    return preg_match("/" . $statement[0] . "/" . $statement[1], $v);
}
function is_email($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('email');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_number($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('number');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_ipv4($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('ipv4');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_ipv6($v) {
    static $statement;
    if (!isset($statement)) {
        $statement = get_input_rules('ipv6');
    }
    return preg_match("/" . $statement . "/", $v);
}
function is_correct_ext($file_name, $exts) {
    $file_name = strtolower($file_name);
    $exts = explode(',', $exts);
    foreach ($exts as $ext) {
        if (ends_with($file_name, '.' . $ext)) {
            return true;
        }
    }
    return false;
}
function format_file_size($s) {
    if ($s < 1024) {
        return $s . 'B';
    }
    if ($s < 1048576) {
        return round($s / 1024) . 'KB';
    }
    if ($s < 1073741824) {
        return round($s / 1048576) . 'MB';
    }
    return round($s / 1073741824) . 'GB';
}
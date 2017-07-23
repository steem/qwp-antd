<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_get_visitor_acls(&$acls) {
    $acls = array(
        'modules' => array(
            'portal' => 1,
        ),
        'pages' => array(
            'portal' => array(
                'sample' => 1,
            ),
        ),
    );
}
/*
privilege structure:
$acls = array(
    'modules' => array(
        'sample' => 'Samples',
        'sample-sub' => 1,
        'sample-sub-sub' => 1,
    ),
    'pages' => array(
        'sample' => array(
            'form' => 'Form sample',
            'table' => 'Table sample',
        ),
        'sample-sub' => array(
            'test' => 1,
        ),
    ),
    'ops' => array(
        'sample#form' => array(
            'edit' => 1,
        ),
        'sample#table' => array(
            'list' => 1,
            'get_types' => 1,
        ),
        'users' => array(
            'list' => 1,
            'add' => 1,
            'edit' => 1,
            'del' => 1,
        ),
    ),
);
*/
function qwp_save_acls_to_db(&$acls) {
    if (!$acls || count($acls) === 0) {
        $acls = array();
        qwp_get_all_acls_in_directory($acls);
    }
    $modules = &$acls['modules'];
    $pages = &$acls['pages'];
    $ops = &$acls['ops'];
    $identities = array();
    db_delete('sys_modules')->execute();
    db_query('ALTER TABLE sys_modules AUTO_INCREMENT=1');
    foreach ($modules as $k => &$v) {
        $items = explode('-', $k);
        array_pop($items);
        if (count($items) === 0) $parent = '';
        else $parent = implode('-', $items);
        $f = array(
            'name' => $v,
            'identity' => $v,
            'parent' => isset($identities[$parent]) ? $identities[$parent] : '0-',
            'type' => 'm',
            'seq' => '1',
        );
        $id = db_insert('sys_modules')->fields($f)->execute();
        $identities[$k] = $f['parent'] . $id . '-';
    }
    foreach ($pages as $k => &$v) {
        foreach ($v as $page => $name) {
            $f = array(
                'name' => $page,
                'identity' => $page,
                'parent' => $identities[$k],
                'type' => 'p',
                'seq' => '1',
            );
            $id = db_insert('sys_modules')->fields($f)->execute();
            $identities[$k.'#'.$page] = $f['parent'] . $id . '-';
        }
    }
    foreach ($ops as $k => &$v) {
        foreach ($v as $page => $name) {
            $f = array(
                'name' => $page,
                'identity' => $page,
                'parent' => $identities[$k],
                'type' => 'op',
                'seq' => '1',
            );
            db_insert('sys_modules')->fields($f)->execute();
        }
    }
}
function qwp_scan_acls_in_directory(&$modules, &$pages, &$ops, $dir, $level, $parent) {
    $files = scandir($dir);
    foreach ($files as $item) {
        if (is_dot_dir($item)) continue;
        $file_path = join_paths($dir, $item);
        if (is_dir($file_path)) {
            if ($level === 0 && $item === 'passport') continue;
            $new_parent = $parent . ($parent ? '-' : '') . $item;
            $modules[$new_parent] = $item;
            qwp_scan_acls_in_directory($modules, $pages, $ops, $file_path, $level + 1, $new_parent);
        } else if ($level !== 0) {
            if (!ends_with($item, '.php') || starts_with($item, 'home') ||
                starts_with($item, 'form_') || starts_with($item, 'common.')) continue;
            $dots = explode('.', $item);
            if (count($dots) !== 2) continue;
            // remove .php
            $item = substr($item, 0, strlen($item) - 4);
            $is_op = strrpos($item, 'ops_');
            if ($is_op === 0) {
                // module ops
                if (!isset($ops[$parent])) $ops[$parent] = array();
                $op_name = substr($item, 4);
                $ops[$parent][$op_name] = $op_name;
            } else if ($is_op !== false) {
                // page ops
                $op_name = substr($item, $is_op + 4);
                $page_key = $parent . '#' . substr($item, 0, $is_op - 1);
                if (!isset($ops[$page_key])) $ops[$page_key] = array();
                $ops[$page_key][$op_name] = $op_name;
            } else {
                // page
                if (!isset($pages[$parent])) $pages[$parent] = array();
                $pages[$parent][$item] = $item;
            }
        }
    }
}
function qwp_get_all_acls_in_directory(&$acls) {
    $acls['modules'] = array();
    $acls['pages'] = array();
    $acls['ops'] = array();
    $modules = &$acls['modules'];
    $pages = &$acls['pages'];
    $ops = &$acls['ops'];
    qwp_scan_acls_in_directory($modules, $pages, $ops, QWP_MODULE_ROOT, 0, '');
    ksort($modules, SORT_STRING);
    ksort($pages, SORT_STRING);
    ksort($ops, SORT_STRING);
    //qwp_save_acls_to_db($acls);
}
function qwp_get_all_acls(&$acls) {

}
function qwp_get_user_acls(&$acls) {
    if (IN_DEBUG) {
        qwp_get_all_acls_in_directory($acls);
        return;
    }
    global $USER;

    $q = db_select('sys_modules', 'm');
    $q->fields('m', array('name', 'parent', 'id', 'type', 'identity'));
    if (!qwp_user_is_admin()) {
        $id_resource = db_select('sys_role','r')->fields('r',array('idresource'))->condition('id',$USER->role)->execute()->fetchAll();
        preg_match_all("/\d+/",$id_resource[0]->idresource,$ids);
        $ids = $ids[0];
        $q->condition(db_or()->condition('id',$ids,'in')->condition('required','y'));
    }
    $q->condition('enabled', 'y')->orderBy('parent', 'asc')->orderBy('seq', 'asc');
    $ret = $q->execute();
    $acls['modules'] = array();
    $acls['pages'] = array();
    $acls['ops'] = array();
    $identities = array(
        '0-' => '',
    );
    $modules = &$acls['modules'];
    $pages = &$acls['pages'];
    $ops = &$acls['ops'];
    $is_page = array();
    while (($r = $ret->fetchAssoc())) {
        $identity = &$r['identity'];
        $parent = &$r['parent'];
        $parent_path = isset($identities[$parent]) && $identities[$parent] ? $identities[$parent] . '-' : '';
        $identity_key = $parent . $r['id'] . '-';
        if ($r['type'] === 'm') {
            $modules[$parent_path . $identity] = $r['name'];
        } else if ($r['type'] === 'p') {
            $path = isset($identities[$parent]) ? $identities[$parent]:'';
            if (!isset($pages[$path])) $pages[$path] = array();
            $pages[$path][$identity] = $r['name'];
            $is_page[$identity_key] = 1;
        } else if ($r['type'] === 'op') {
            $path = isset($identities[$parent]) ? $identities[$parent]:'';
            if (isset($is_page[$parent])) {
                $pos = strrpos($path, '-');
                $path[$pos] = '#';
            }
            if (!isset($ops[$path])) $ops[$path] = array();
            $ops[$path][$identity] = $r['name'] ? $r['name'] : 1;
        }
        $identities[$identity_key] = $parent_path . $identity;
    }
}
function qwp_init_nav_modules(&$acls) {
    $modules = array();
    $sub_modules = array();
    $all_modules = &$acls['modules'];
    $left_modules = array();
    foreach($all_modules as $m => $desc) {
        $arr = explode('-', $m);
        $level = count($arr);
        if ($level === 1) {
            if (file_exists(join_paths(QWP_MODULE_ROOT, $m, 'home.php'))) {
                $modules[$m] = $desc;
            } else {
                $left_modules[$m] = $desc;
            }
        } else if ($level === 2) {
            if (isset($left_modules[$arr[0]]) && file_exists(join_paths(QWP_MODULE_ROOT, implode('/', $arr), 'home.php'))) {
                // select the first module
                $modules[$m] = $left_modules[$arr[0]];
                unset($left_modules[$arr[0]]);
            }
            if (!isset($sub_modules[$arr[0]])) $sub_modules[$arr[0]] = array();
            $sub_modules[$arr[0]][$m] = array('desc' => $desc);
        } else if ($level === 3) {
            if (isset($left_modules[$arr[0]]) && file_exists(join_paths(QWP_MODULE_ROOT, implode('/', $arr), 'home.php'))) {
                // select the first module
                $modules[$m] = $left_modules[$arr[0]];
                unset($left_modules[$arr[0]]);
            }
            $parent = $arr[0] . '-' . $arr[1];
            if (!isset($sub_modules[$arr[0]][$parent]['sub'])) $sub_modules[$arr[0]][$parent]['sub'] = array();
            $sub_modules[$arr[0]][$parent]['sub'][] = array($m, $desc);
        }
    }
    $modules = array_reverse($modules);
    _C('nav', $modules);
    _C('sub_nav', $sub_modules);
}
function qwp_has_sub_modules() {
    global $MODULE;

    $nav = C('sub_nav', array());
    return isset($nav[$MODULE[0]]);
}
// template function, you need to modify it if you want to use
function qwp_init_security(&$acls) {
    $acls = array();
    qwp_get_user_acls($acls);
    _C('acls', $acls);
    qwp_init_nav_modules($acls);
}
function qwp_doing_security_check() {
    global $MODULE_URI, $PAGE, $OP;

    if (qwp_is_passport_module()) {
        return true;
    }
    $acls = C('acls', null);
    if (!$acls) {
        qwp_init_security($acls);
    }
    if (!isset($acls['modules'][$MODULE_URI])) {
        return false;
    }
    if ($OP) {
        $path = $MODULE_URI;
        if ($PAGE) {
            $path .= '#' . $PAGE;
        }
        return isset($acls['ops'][$path]) && isset($acls['ops'][$path][$OP]);
    }
    if ($PAGE) {
        return isset($acls['pages'][$MODULE_URI]) && isset($acls['pages'][$MODULE_URI][$PAGE]);
    }
    log_info('security check is passed: ' . $MODULE_URI);
}
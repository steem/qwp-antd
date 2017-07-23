<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_tmpl_render_nav() {
    global $MODULE;

    $nav = C('nav', array());
    $html = '';
    foreach ($nav as $item => $desc) {
        $active = '';
        $tmp = explode('-', $item);
        if ($MODULE[0] == $tmp[0]) {
            $active = ' class="active"';
        }
        $src = join_paths('img', $tmp[0] . '.png');
        $icon = file_exists(join_paths(QWP_ROOT, $src)) ? "<img src='$src' width='16px' height='16px'> " : '<i class="fa fa-th"></i>';
        $html .= format('<li{0} title="{3}"><a href="{1}">{2}<span> {3}</span></a></li>', $active, qwp_uri_module($item), $icon, L($desc));
    }
    echo($html);
}
function qwp_tmpl_render_sub_modules() {
    global $MODULE, $MODULE_URI;
	$icon_arr = array('accounts'=>'glyphicon-home', 'alarm'=>'glyphicon-alert','commentator'=>'glyphicon-flag','content_search'=>'glyphicon-search','hotTopic'=>'glyphicon-fire','timeline'=>'glyphicon-pencil');

    $nav = C('sub_nav', array());
    if (!isset($nav[$MODULE[0]])) return;
    $html = '';
    foreach ($nav[$MODULE[0]] as $uri => $module) {
	    if(array_key_exists($module['desc'], $icon_arr)){
		    $icon = $module['desc'];
		    $icon = $icon_arr[$icon];
		    $icon = "<i class='glyphicon {$icon}'></i>";
	    }else{
		    $src = join_paths('img', $uri . '.png');
		    $icon = file_exists(join_paths(QWP_ROOT, $src)) ? "<img src='$src'> " : '<i class="fa fa-files-o"></i>';
	    }
        if (isset($module['sub'])) {
            $module_active = '';
            if (starts_with($MODULE_URI, $uri)) $module_active = ' active';
            $html .= format('<li class="treeview{0}"><a href="{1}">{3} <span>{2}</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a><ul class="treeview-menu">',
                $module_active, qwp_uri_module($uri), $module['desc'], $icon);
            foreach ($module['sub'] as &$item) {
                $active = '';
                $text_class = '';
                if ($item[0] == $MODULE_URI) {
                    $active = ' class="active"';
                    $text_class = ' text-aqua';
                }
                $html .= format('<li{0}><a href="{1}"><i class="fa fa-circle-o{3}"></i> <span>{2}</span></a></li>',
                    $active, qwp_uri_module($item[0]), $item[1], $text_class);
            }
            $html .= '</ul></li>';
        } else {
            $active = '';
            if ($uri == $MODULE_URI) $active = ' class="active"';
            $html .= format('<li{0}><a href="{1}">{3} <span>{2}</span></a></li>',
                $active, qwp_uri_module($uri), L($module['desc']), $icon);
        }
    }
    echo($html);
}
function qwp_tmpl_has_sub_modules($m) {
    $nav = C('sub_nav', array());
    return isset($nav[$m]) ? true : false;
}
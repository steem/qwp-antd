<?php
function import_echarts() {
    qwp_include_js_file('echarts.min.js');
    qwp_include_js_file('macarons.js');
}
function import_datetime() {
    global $language;

    qwp_include_css_file('bootstrap-datetimepicker.min.css');
    qwp_include_js_file('bootstrap-datetimepicker.min.js');
    if ($language != 'en') qwp_include_js_file("locales/bootstrap-datetimepicker.$language.js");
}
function import_date_range_time(){
    qwp_include_js_file('moment.min.js');
    qwp_include_js_file('daterangepicker.js');
    qwp_include_css_file('bootstrap-daterangepicker.css');
}
function qwp_render_add_im() {
    qwp_add_js_code(QWP_UI_ROOT . '/loading.js');
    qwp_add_js_code(QWP_UI_ROOT . '/im.js');
}
function get_supported_target_sites_array(&$arr) {
    $arr = array(
        '100' => array(L('Telegram'), 'telegram.png'),
        '101' => array(L('WhatsAPP'), 'whatsapp.png'),
    );
}
function get_notification_count()
{
    return 10;
}
function get_notification_content()
{?>
    <li class="header">You have 10 notifications</li>
    <li>
        <ul class="menu">
            <li>
                <a href="#">
                    <i class="fa fa-users text-aqua"></i> 5 new members joined today
                </a>
            </li>
        </ul>
    </li>
    <li class="footer"><a href="#">View all</a></li>
<?php
}
function render_notification_nav()
{?>
    <li class="dropdown notifications-menu">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <i class="fa fa-bell-o"></i>
            <span class="label label-warning"><?php echo(get_notification_count());?></span>
        </a>
        <ul class="dropdown-menu"><?php get_notification_content();?></ul>
    </li>
    <?php
}
<?php if(!defined('QWP_ROOT')){exit('Invalid Request');}
require_once(QWP_ROOT . '/security/admin_nav.php');
qwp_render_header();
?><body class="hold-transition skin-blue fixed sidebar-mini">
<?php render_modify_pwd_dialog();?>
<div class="wrapper">
    <header class="main-header">
        <a href="#" class="logo">
            <span class="logo-mini"><b><img src="img/logo_f.png" style="width:30px;" /></b></span>
            <span class="logo-lg" style="text-align:left"><img src="img/logo_f.png" style="width:30px;margin-right:10px;" /><b><?php EL(PRODUCT_NAME);?></b></span>
        </a>
        <nav class="navbar navbar-static-top">
<?php if (qwp_has_sub_modules()) {?>
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
<?php }?><div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <?php qwp_tmpl_render_nav();?>
                    <?php render_notification_nav();?>
                    <?php render_user_nav();?>
                </ul>
            </div>
        </nav>
    </header>
    <aside class="main-sidebar">
        <section class="sidebar">
            <ul class="sidebar-menu">
                <!-- <li class="header">MAIN NAVIGATION</li> -->
	            <li class="header"></li>
                <?php qwp_tmpl_render_sub_modules();?>
            </ul>
        </section>
    </aside>
    <div class="content-wrapper">
        <section class="content">
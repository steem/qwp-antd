<?php if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_render_header();?><body>
<div class="container">
    <div class="page-header">
        <h1>Ops... </h1>
    </div>
    <p class="lead">Something goes wrong! Please follow the instructions below to fix the issue.</p>
    <p><?php echo($error_description);?></p>
</div>
<footer class="footer">
    <div class="container">
        <p class="text-muted">&copy; <?php echo(COMPANY_NAME. ' ' . get_year());?></p>
    </div>
</footer>
<?php qwp_render_footer();?>
</body>
</html>
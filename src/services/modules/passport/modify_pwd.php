<?php if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_ui_init_dialog();
?>
<form id="pwd_info" class="form-horizontal col-lg-12" action="<?php echo(qwp_uri_ops('modify_pwd', null, null, 'passport'));?>" method="post">
    <div class="form-group">
        <label for="f_old_pwd" class="col-sm-4 control-label"><?php EL('Old Password');?></label>
        <div class="col-sm-8">
            <input type="password" name="f[old_pwd]" id="f_old_pwd" class="form-control">
        </div>
    </div>
    <div class="form-group">
        <label for="f_pwd" class="col-sm-4 control-label"><?php EL('New Password');?></label>
        <div class="col-sm-8">
            <input type="password" name="f[pwd]" id="f_pwd" class="form-control">
        </div>
    </div>
    <div class="form-group">
        <label for="f_pwd1" class="col-sm-4 control-label"><?php EL('Retype New Password');?></label>
        <div class="col-sm-8">
            <input type="password" name="f[pwd1]" id="f_pwd1" class="form-control">
        </div>
    </div>
</form>
<script>
function modifyPwd() {
    qwp.topNotice($L('Password is being modified, please wait...'));
    qwp.post({
        url:qwp.uri.ops('modify_pwd'),
        params: $('#pwd_info').serialize(),
        fn: function(res) {
            qwp.topNotice(res.msg, res.ret ? 'info' : 'warning');
        }
    });
}
</script>
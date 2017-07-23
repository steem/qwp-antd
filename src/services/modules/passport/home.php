<?php if(!defined('QWP_ROOT')){exit('Invalid Request');} ?><div class="login-box">
<div class="login-logo">
    <a href="#"><?php EL(PRODUCT_NAME);?></a>
</div>
<div class="login-box-body">
    <p class="login-box-msg"><?php EL('Sign in to start your session');?></p>

    <form id="form-signin" action="<?php echo(qwp_uri_current_ops('login'));?>" method="post">
        <input type="hidden" name="dsturl" value="<?php echo(P('dsturl'));?>">
        <div class="form-group has-feedback">
            <input type="text" name="f[user]" id="user" class="form-control" placeholder="<?php EL('User');?>" value="">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
            <input type="password" name="f[pwd]" id="inputPassword" class="form-control" placeholder="<?php EL('Password');?>" value="123Qwe">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
            <div class="col-xs-8">
                <div class="checkbox icheck">
                    <label>
                        <input type="checkbox" class="square"> <?php EL('Remember Me');?>
                    </label>
                </div>
            </div>
            <div class="col-xs-4">
                <button type="submit" class="btn btn-primary btn-block btn-flat"><?php EL('Sign In');?></button>
            </div>
        </div>
    </form>
    <a href="#"><?php EL('I forgot my password');?></a><br>
</div>
</div>

<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');} ?>
<script>
    function loginInvalidHandler(e, v) {
        qwp.notice($L('Number of invalid items: {0}', v.numberOfInvalids()));
    }
    function loginBeforeSubmit(v, f, e) {
        $("button[type='submit']").attr('disable', true);
    }
    function loginActionHandler(res, data) {
        if (!res.ret) $("button[type='submit']").attr('disable', false);
    }
</script>
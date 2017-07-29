<?php if(!defined('QWP_ROOT')){exit('Invalid Request');}
qwp_logout();
if (QWP_JUST_SERVICE) {
  qwp_create_and_echo_json_response(true, false, 'success');
  exit();
}
?><!DOCTYPE html>
<html>
<script>
top.location.href = "./";
</script>
</html>
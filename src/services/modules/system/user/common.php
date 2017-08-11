<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function get_user_data_modal(&$modal) {
    $modal = array(
        array(
            'table' => 'u',
            array('avatar', '', 40, false, true, true),
            array('name', 'Name', '10', true, true),
            array('nickName', 'NickName', '10', true),
            array('age', 'Age', '10', true),
            array('isMale', '', '10', true, true),
            array('phone', 'Phone', '20', true),
            array('email', 'Email', '20', true),
            array('address', 'Address', '30', true),
            array('createTime', 'CreateTime', '20'),
            array('', '', '20', false, 'operation'),
            'id',
        ),
    );
}

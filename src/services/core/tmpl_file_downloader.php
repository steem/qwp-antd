<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('IN_MODULE')){exit('Invalid Request');}
if (function_exists('get_download_file'))
{
    $file_info = '';
    try
    {
        get_download_file($file_info);
        if (!$file_info)
        {
            req_not_found();
        }
        else
        {
            if (is_string($file_info))
            {
                download_file($file_info, basename($file_info));
            }
            else
            {
                $content_type = isset($file_info['content_type']) ? $file_info['content_type'] : "application/force-download";
                $file_name = isset($file_info['name']) ? $file_info['name'] : basename($file_info['path']);
                download_file($file_info['path'], $file_name, $content_type);
            }
        }
    }
    catch(Exception $e)
    {
        req_not_found();
    }
}
else if (function_exists('get_download_data'))
{
    $content_info = '';
    try
    {
        get_download_data($content_info);
        if (!$content_info)
        {
            req_not_found();
        }
        else
        {
            if (is_array($content_info))
            {
                $content_type = isset($content_info['content_type']) ? $content_info['content_type'] : "application/force-download";
                $file_name = isset($content_info['name']) ? $content_info['name'] : 'download.dat';
                set_output_file($file_name, $content_type, true, strlen($content_info['data']));
                echo($content_info['data']);
            }
            else
            {
                set_output_file('download.dat');
                echo($content_info);
            }
        }
    }
    catch(Exception $e)
    {
        req_not_found();
    }
}
else
{
    req_not_found();
}
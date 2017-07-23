function createDateRangePicker(selector){
    $(selector).daterangepicker({
        timePicker: true,
        timePickerIncrement: 5,
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
        }
    }).val('').on('hide.daterangepicker',function(){
        $(this).attr('title',$(this).val());
    }).on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
}
function base64ImgSrc(data, type) {
    if (!type) type = 'jpeg';
    return 'data:image/' + type + ';base64,' + data;
}
function base64Img(data, type) {
    if (!type) type = 'jpeg';
    return $h.img({src:'data:image/' + type + ';base64,' + data});
}
function convertSizeInMb(s) {
    s = parseInt(s);
    if (s >= 1024 * 1024) {
        s = Math.round(s / (1024 * 1024)) + ' TB';
    } else if (s >= 1024) {
        s = Math.round(s / 1024) + ' GB';
    } else {
        s += ' MB';
    }
    return s;
}
function convertUpTime(s) {
    s = parseInt(s);
    if (s >= 60 * 60) {
        s = (s / (60 * 60)).toFixed(1) + ' Hours';
    } else if (s >= 60) {
        s = (s / 60).toFixed(1) + ' Minutes';
    } else {
        s += ' Seconds';
    }
    return s;
}
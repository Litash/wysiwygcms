/*
** JavaScript to control site layout behaviours on Chameleon CMS
** Author: Yichen Lu
*/

jQuery(document).ready(function($) {
    $('#siteURL').focus(function(event) {
        var siteName = $('#siteName').val();
        $(this).val('/'+siteName);
    });
    $('#btn_create_site').click(function(event) {
        event.preventDefault();
        $('#create_site_frm').submit();
    });

});
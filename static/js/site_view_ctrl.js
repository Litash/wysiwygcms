/*
** JavaScript to control site layout behaviours on Chameleon CMS
** Author: Yichen Lu
*/

jQuery(document).ready(function($) {
    $('#siteURL').focus(function(event) {
        var siteNameNoSpace = $.trim($('#siteName').val());
        $(this).val('/site/'+siteNameNoSpace);
    });
    $('#btn_create_site').click(function(event) {
        event.preventDefault();
        $('#create_site_frm').submit();
    });

    $('.delete-site').click(function(event) {
        var siteName = $(this).siblings('a').text();
        if (confirm("Confirm to delete this site and ALL corresponding pages? ")) {
            $('#delete_site_url').val($(this).siblings('a').attr('href'));
            $('#delete_site_frm').submit();
        }
    });
});
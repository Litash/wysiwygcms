/*
** JavaScript to control TinyMCE text editor behaviours on Litash CMS
** Author: Yichen Lu
*/

$('.editable').hide();
// initialize TinyMCE
tinymce.init({
    selector: 'textarea.richTxtEditor', // change this value according to your HTML
    theme: 'modern',
    height: 400,
    plugins: [
        'advlist autolink lists link image charmap hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'paste textcolor colorpicker textpattern imagetools'
    ],
    toolbar1: 'undo redo | fontselect fontsizeselect styleselect | bold italic forecolor backcolor ',
    toolbar2: 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
    content_css: [
        '/static/bower_components/bootstrap/dist/css/bootstrap.min.css',
        '/static/css/styles.css'
    ]
});


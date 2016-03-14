/*
** JavaScript to control TinyMCE text editor behaviours on Litash CMS
** Author: Yichen Lu
*/

$('.editable').hide();
// initialize TinyMCE
tinymce.init({
    selector: 'textarea.richTxtEditor', // change this value according to your HTML
    theme: 'modern',
    height: 480,
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

// =======================================
// functions for control content text editor
// =======================================

// global variables
var editor;
var isContentChanged = 0;

// double click trigger for content text editor
$('.viewable').dblclick(function(event) {
    openTextEditor();
});

// switch on text editor for page content
function openTextEditor() {
    $('.viewable').hide();
    $('.editable').show();
}

function closeTextEditor() {
    if (isChanged()) {
        if (confirm("You have made some changes, cancel without saving?")) {
            $('.editable').hide();
            $('.viewable').show();
            tinymce.activeEditor.setContent($('div.viewable').html());
        }
    }else{
        $('.editable').hide();
        $('.viewable').show();
    }
}

// save text functions
$('#save_changes').on('click', function(event) {
    event.preventDefault();
    saveContent();
});

// function to detect if there is any changes made
function isChanged() {
    var rawViewableTxt = new String($('div.viewable').html());
    var rawEditableTxt = new String(tinymce.activeEditor.getContent());
    var viewableTxt = $.trim(rawViewableTxt);
    var editableTxt = $.trim(rawEditableTxt);

    if (viewableTxt===editableTxt) {
        console.log("False");
        return false;
    }else{
        console.log("True");
        return true;
    }
}

// function for saving main content
function saveContent() {
    var updateTxt = $('#contetnEditor').text();
    // console.log(updateTxt);
    // $.trim($('#content_wysihtml_editor').html());
    if (updateTxt=='') {
        if (confirm("You are about to save empty text, are you sure?")) {
            // $('#update_text').val(updateTxt);
            $('#update_content').submit();
        };
    } else{
        // $('#update_text').val(updateTxt);
        $('#update_content').submit();
    };
}

$('#cancel_changes').click(function(event) {
    closeTextEditor();
});

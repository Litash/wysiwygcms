// global variables
var txt = $('.editable').html();
var editor;
var isContentChanged = 0;

// code for side panel editor, need to be initialized before doeument ready
sideEditor = new wysihtml5.Editor('side_wysihtml_editor', {
    toolbar: 'side_wysihtml_toolbar',
    parserRules: wysihtml5ParserRules // defined in file parser rules javascript
});


// code for wysihtml editor and start edit mode
$('a.side-edit-mode').on('click', function(event) {
    event.preventDefault();
    view2Edit ();

    // var wysihtmlBone = '<div id="content_wysihtml_toolbar" class="wysihtml-toolbar" style="display: none;"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on" title="bold"><i class="fa fa-bold"></i></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on" title="italic"><i class="fa fa-italic"></i></button> <button class="btn btn-default" data-wysihtml5-command="underline" unselectable="on" title="underline"><i class="fa fa-underline"></i></button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" unselectable="on"><i class="fa fa-header"></i>1</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" unselectable="on"><i class="fa fa-header"></i>2</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" unselectable="on"><i class="fa fa-header"></i>3</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" unselectable="on"><span class="red">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" unselectable="on"><span class="green">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" unselectable="on"><span class="blue">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="createLink" title="insert link"><i class="fa fa-link" unselectable="on"></i></button> <button type="submit" id="save_changes" class="btn btn-default pull-right" title="Save changes"><i class="fa fa-floppy-o"></i></button> <!-- <button class="btn btn-default pull-right" data-wysihtml5-command="redo" title="redo"><i class="fa fa-repeat"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="undo" title="undo"><i class="fa fa-undo"></i></button> --> <div data-wysihtml5-dialog="createLink" style="display: none;"> <input data-wysihtml5-dialog-field="href" value="http://" class="text form-control"> <div class="pull-right"> <button class="btn btn-default" data-wysihtml5-dialog-action="cancel">Cancel</button> <button class="btn btn-primary" data-wysihtml5-dialog-action="save">OK</button> </div> </div></div><div id="content_wysihtml_editor" class="wysihtml-editor"></div>'
    // $('.editable').html(wysihtmlBone)
    // editor = new wysihtml5.Editor('content_wysihtml_editor', {
    //     toolbar: 'content_wysihtml_toolbar',
    //     parserRules: wysihtml5ParserRules // defined in file parser rules javascript
    // });
    // editor.setValue(txt, true);
    // editor.on("change", onChange);

    $('a.side-view-mode').show();
    $(this).hide();


});

jQuery(document).ready(function($) {
    // switch on text editor for page content
    function openTextEditor() {
        $('.editable').html(wysihtmlBone)
        editor = new wysihtml5.Editor('content_wysihtml_editor', {
            toolbar: 'content_wysihtml_toolbar',
            parserRules: wysihtml5ParserRules // defined in file parser rules javascript
        });
        editor.setValue(txt, true);
        editor.on("change", onChange);

        // save text functions
        $('#save_changes').on('click', function(event) {
            event.preventDefault();
            saveContent();
            edit2View ();
        });

        $('#content_view').click(function(event) {
            if (isContentChanged==1) {
                if (confirm("You have made some changes, do you want to save it?")) {
                    saveContent();
                } else{
                    $('.editable').html(txt);
                };
            }else{
                $('.editable').html(txt);
            };
            isContentChanged = 0;
        });
    }

    // double click trigger for content text editor
    $('.editable').dblclick(function(event) {
        openTextEditor();
    });

    // view content button
    $('#content_view').click(function(event) {
        if (isContentChanged==1) {
            if (confirm("You have made some changes, do you want to save it?")) {
                saveContent();
            } else{
                $('.editable').html(txt);
            };
        }else{
            $('.editable').html(txt);
        };
        isContentChanged = 0;
    });

    // function for saving main content
    function saveContent() {
        var updateTxt = editor.getValue();
        // console.log(updateTxt);
        // $.trim($('#content_wysihtml_editor').html());
        if (updateTxt=='') {
            if (confirm("You are about to save empty text, are you sure?")) {
                $('#update_text').val(updateTxt);
                $('#update_content').submit();
            };
        } else{
            $('#update_text').val(updateTxt);
            $('#update_content').submit();
        };
    }
});
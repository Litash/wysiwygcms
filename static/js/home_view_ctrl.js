/*
** JavaScript to control behaviour of the CMS
** Author: Yichen Lu
*/

var wysihtmlBone;
// Responsive optimization
(function($) {
    var $window = $(window),
        $html = $('.side-panel');

    // function for setting different text editor for different viewport size
    function resize() {
        if ($window.width() < 640) {
            wysihtmlBone = '<div id="content_wysihtml_toolbar" class="wysihtml-toolbar" style="display: none;"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on" title="bold"><i class="fa fa-bold"></i></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on" title="italic"><i class="fa fa-italic"></i></button> <button class="btn btn-default" data-wysihtml5-command="underline" unselectable="on" title="underline"><i class="fa fa-underline"></i></button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" unselectable="on"><i class="fa fa-header"></i>1</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" unselectable="on"><i class="fa fa-header"></i>2</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" unselectable="on"><i class="fa fa-header"></i>3</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" unselectable="on"><span class="red">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" unselectable="on"><span class="green">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" unselectable="on"><span class="blue">&nbsp;</span></button> <button class="btn btn-default" data-wysihtml5-command="createLink" title="insert link"><i class="fa fa-link" unselectable="on"></i></button> <button type="submit" id="save_changes" class="btn btn-default pull-right" title="Save changes"><i class="fa fa-floppy-o"></i></button> <!-- <button class="btn btn-default pull-right" data-wysihtml5-command="redo" title="redo"><i class="fa fa-repeat"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="undo" title="undo"><i class="fa fa-undo"></i></button> --> <div data-wysihtml5-dialog="createLink" style="display: none;"> <input data-wysihtml5-dialog-field="href" value="http://" class="text form-control"> <div class="pull-right"> <button class="btn btn-default" data-wysihtml5-dialog-action="cancel">Cancel</button> <button class="btn btn-primary" data-wysihtml5-dialog-action="save">OK</button> </div> </div></div><div id="content_wysihtml_editor" class="wysihtml-editor"></div>';
            return $html.removeClass('pull-right');
        }
        wysihtmlBone = '<div id="content_wysihtml_toolbar" class="wysihtml-toolbar" style="display:none"> <div class="row toolbar-main"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on" title="bold"><i class="fa fa-bold"></i></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on" title="italic"><i class="fa fa-italic"></i></button> <button class="btn btn-default" data-wysihtml5-command="underline" unselectable="on" title="underline"><i class="fa fa-underline"></i></button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" unselectable="on"><i class="fa fa-header"></i>1</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" unselectable="on"><i class="fa fa-header"></i>2</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" unselectable="on"><i class="fa fa-header"></i>3</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" unselectable="on"> <span class="red">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" unselectable="on"> <span class="green">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" unselectable="on"> <span class="blue">&nbsp; </span> </button> <button class="btn btn-default" data-wysihtml5-command="createLink" title="insert link"><i class="fa fa-link"></i></button> <button class="btn btn-default" id="insert_img" title="Insert image"><i class="fa fa-picture-o"></i></button> <button class="btn btn-default" id="upload_file" title="Upload files"><i class="fa fa-files-o"></i></button> <button type="submit" class="btn btn-primary pull-right" id="save_changes" title="Save changes"><i class="fa fa-floppy-o"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="redo" title="redo"><i class="fa fa-repeat"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="undo" title="undo"><i class="fa fa-undo"></i></button> <button type="submit" class="btn btn-default pull-right" id="content_view" title="View"><i class="fa fa-eye"></i></button> </div> <div data-wysihtml5-dialog="createLink" style="display:none" class="row"> <div class="input-group"> <input data-wysihtml5-dialog-field="href" value="http://" class="text form-control"> <span class="input-group-btn"> <button class="btn btn-primary" data-wysihtml5-dialog-action="save" type="button">OK</button> </span> </div> </div> </div> <div id="content_wysihtml_editor" class="wysihtml-editor"> </div>';
        $html.addClass('pull-right');
    }

    $window.resize(resize).trigger('resize');
})(jQuery);

// code for side panel editor, need to be initialized before doeument ready
sideEditor = new wysihtml5.Editor('side_wysihtml_editor', {
    toolbar: 'side_wysihtml_toolbar',
    parserRules: wysihtml5ParserRules // defined in file parser rules javascript
});

var isContentChanged = 0;
var sideitem;
var sideIsChanged = 0;
var updateItemId;
var isNewSideItem = 0;

$(document).on('click', '.side-panel li.list-hover', function(event) {
    event.preventDefault();
    isNewSideItem = 0
    sideitem = $(this).html();
    setModalValue (sideitem);
    updateItemId = getItemID($(this));

    $('#side_delete_item').show();
});

// add item
$(document).on('click', 'li.list-group-item.add-list-item', function(event) {
    event.preventDefault();
    isNewSideItem = 1;
    sideitem = "";
    setModalValue (sideitem);
    $('#side_wysihtml_editor').addClass('expand-modal-editor');
    $('#side_delete_item').hide();
});

function setModalValue (sideitem) {
    $('#side_panel_modal').modal('show');
    sideEditor.setValue(sideitem, true);
    sideEditor.on("change", sideOnChange);
}

function getItemID (itemDOM) {
    var idTxt = itemDOM.attr('id');
    var id = idTxt.replace("side_item_","");
    return id;
}

function sideOnChange (sideIsChanged) {
    sideIsChanged = 1;
}

// function for creating right panel item
function createSideItem() {
    var updateItem = sideEditor.getValue();
    // $.trim($('#content_wysihtml_editor').html());
    if (updateItem=='') {
        if (confirm("You are about to save empty text, are you sure?")) {
            $('#side_create_text').val(updateItem);
            $('#side_create_url').val(updateItemId);
            $('#create_side').submit();
        };
    } else{
        $('#side_create_text').val(updateItem);
        $('#side_create_url').val(updateItemId);
        $('#create_side').submit();
    };
}

// function for saving right panel item
function saveSideItem() {
    var updateItem = sideEditor.getValue();
    if (updateItem=='') {
        if (confirm("You are about to save empty text, are you sure?")) {
            $('#side_update_text').val(updateItem);
            $('#side_update_id').val(updateItemId);
            $('#update_side').submit();
        };
    } else{
        $('#side_update_text').val(updateItem);
        $('#side_update_id').val(updateItemId);
        $('#update_side').submit();
    };
}

function deleteSideItem () {
    if (confirm("Confirm to delete this message?")) {
        $('#side_delete_id').val(updateItemId);
        $('#delete_side').submit();
        console.log(updateItemId)
    };
}


// upload modal trigger
$(document).on('click', '#insert_img', function(event) {
        $('#upload_img_modal').modal('show');
});

jQuery(document).ready(function($) {
    // hide some elements when initialized
    $('.side-view-mode').hide();
    $('#save_changes').hide();
    $('#side_panel_modal').modal('hide');
    $('#upload_img_modal').modal('hide');

    // global variables
    var txt = $('.editable').html();
    var editor;

    // code for wysihtml editor and start edit mode
    $('.side-edit-mode').on('click', function(event) {
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

        $('.side-view-mode').show();
        $(this).hide();


    });

    $('#side_save_changes').on('click', function(event) {
        event.preventDefault();
        if (isNewSideItem == 0) {
            saveSideItem();
        } else{
            createSideItem();
        };
    });

    $('.editable').dblclick(function(event) {
        $(this).html(wysihtmlBone)
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
    });

    function onChange() {
        isContentChanged = 1;
    }

    // mode ctrl
    $('.side-view-mode').on('click', function(event) {
        event.preventDefault();
        if (sideIsChanged==1) {
            if (confirm("You have made some changes, do you want to save it?")) {
                saveContent();
                saveSideItem()
            } else{
                edit2View ();
            };
        }else{
            edit2View ();
        };
        // isContentChanged = 0;
        sideIsChanged=0;
    });

    function view2Edit () {
        $('.side-view-mode').show();
        $('.side-edit-mode').hide();
        $('.side-panel ul.list-group').prepend('<li class="list-group-item add-list-item" title="Add item"><i class="fa fa-plus fa-2"></i></li>')
        $('.side-panel ul.list-group li').addClass('list-hover');
        $('.side-panel ul.list-group li.add-list-item').removeClass('list-hover');
    }

    function edit2View () {
        $('.side-edit-mode').show();
        $('.side-view-mode').hide();
        // $('.editable').html(txt);
        $('.side-panel ul.list-group li.add-list-item').remove();
        $('.side-panel ul.list-group li').removeClass('list-hover');
    }

    // function for saving main content
    function saveContent() {
        var updateTxt = editor.getValue();
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

    $('#side_panel_modal').on('hidde.bs.modal', function(event) {
        event.preventDefault();
        if (sideIsChanged) {
            if (confirm("You have made some changes, do you want to save?")) {
                saveSideItem();
            };
        };
        $('#side_wysihtml_editor').removeClass('expand-modal-editor');
    });

    $('#side_delete_item').click(function(event) {
        deleteSideItem()
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

    // $('#btn_upload').click(function(event) {
    //     $('#img_upload_frm').submit();
    // });

});

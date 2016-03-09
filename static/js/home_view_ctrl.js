/*
** JavaScript to control home layout behaviours on Litash CMS
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
            // small screen
            wysihtmlBone = '<div id="content_wysihtml_toolbar" class="wysihtml-toolbar" style="display:none"> <div class="toolbar-main"> <div class="row"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on" title="Bold"><i class="fa fa-bold"></i></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on" title="Italic"><i class="fa fa-italic"></i></button> <button class="btn btn-default" data-wysihtml5-command="underline" unselectable="on" title="Underline"><i class="fa fa-underline"></i></button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" unselectable="on"><i class="fa fa-header"></i>1</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" unselectable="on"><i class="fa fa-header"></i>2</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" unselectable="on"><i class="fa fa-header"></i>3</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" unselectable="on"> <span class="red">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" unselectable="on"> <span class="green">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" unselectable="on"> <span class="blue">&nbsp; </span> </button> <button class="btn btn-default" data-wysihtml5-command="insertOrderedList" title="Ordered List" type="button"><i class="fa fa-list-ol"></i></button> <button class="btn btn-default" data-wysihtml5-command="insertUnorderedList" title="Unordered List" type="button"><i class="fa fa-list-ul"></i></button> <button type="submit" class="btn btn-primary pull-right" id="save_changes" title="Save Changes"><i class="fa fa-floppy-o"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="redo" title="Redo"><i class="fa fa-repeat"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="undo" title="Undo"><i class="fa fa-undo"></i></button> <button type="submit" class="btn btn-default pull-right" id="content_view" title="View"><i class="fa fa-eye"></i></button> </div> </div> </div> <div id="content_wysihtml_editor" class="wysihtml-editor"> </div>';
            return $html.removeClass('pull-right');
        }
        // big screen
        wysihtmlBone = '<div id="content_wysihtml_toolbar" class="wysihtml-toolbar" style="display:none"> <div class="toolbar-main"> <div class="row"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on" title="Bold"><i class="fa fa-bold"></i></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on" title="Italic"><i class="fa fa-italic"></i></button> <button class="btn btn-default" data-wysihtml5-command="underline" unselectable="on" title="Underline"><i class="fa fa-underline"></i></button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" unselectable="on"><i class="fa fa-header"></i>1</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" unselectable="on"><i class="fa fa-header"></i>2</button> <button class="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" unselectable="on"><i class="fa fa-header"></i>3</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red" unselectable="on"> <span class="red">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green" unselectable="on"> <span class="green">&nbsp;</span> </button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue" unselectable="on"> <span class="blue">&nbsp; </span> </button> <button class="btn btn-default" data-wysihtml5-command="insertOrderedList" title="Ordered List" type="button"><i class="fa fa-list-ol"></i></button> <button class="btn btn-default" data-wysihtml5-command="insertUnorderedList" title="Unordered List" type="button"><i class="fa fa-list-ul"></i></button> <button type="submit" class="btn btn-primary pull-right" id="save_changes" title="Save Changes"><i class="fa fa-floppy-o"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="redo" title="Redo"><i class="fa fa-repeat"></i></button> <button class="btn btn-default pull-right" data-wysihtml5-command="undo" title="Undo"><i class="fa fa-undo"></i></button> <button type="submit" class="btn btn-default pull-right" id="content_view" title="View"><i class="fa fa-eye"></i></button> </div> <div class="row"> <button class="btn btn-default" data-wysihtml5-command="createLink" title="Insert Link" type="button"><i class="fa fa-link"></i></button> <button class="btn btn-default" data-wysihtml5-command="insertImage" id="insert_img" title="Insert Image" type="button"><i class="fa fa-picture-o"></i></button> <button class="btn btn-default" id="upload_file" title="Upload Files"><i class="fa fa-upload"></i></button> <a class="btn btn-default" href="/uploads" title="Browse Files" target="_blank"><i class="fa fa-folder-open-o"></i></a> </div> </div> <div class="row"> <div data-wysihtml5-dialog="createLink" style="display:none" class="row"> <label for="link-url">Link URL</label> <div class="input-group"> <input id="link-url" data-wysihtml5-dialog-field="href" value="http://" class="text form-control"> <span class="input-group-btn"> <button class="btn btn-primary" data-wysihtml5-dialog-action="save" type="button">OK</button> </span> </div> </div> <div data-wysihtml5-dialog="insertImage" style="display:none" class="row"> <label for="img-url">Image URL</label> <div class="input-group"> <input id="img-url" class="form-control" data-wysihtml5-dialog-field="src" value="http://"> <span class="input-group-btn"> <button class="btn btn-primary" data-wysihtml5-dialog-action="save" type="button">OK</button> </span> </div> </div> </div> </div> <div id="content_wysihtml_editor" class="wysihtml-editor"> </div>';
        $html.addClass('pull-right');
    }

    $window.resize(resize).trigger('resize');
})(jQuery);


// activate menu item based on url
var url = $('input#page_url').val();
// var splitURL = url.split('/');
// var jointURL = "/"+splitURL[3]+"/"+splitURL[4]+"/"+splitURL[5];
$('#menu-items ul.nav.navbar-nav li a').each(function(index, el) {
    if ($(el).attr('href')==url) {
        $(el).parent('li').addClass('active');
    }
});

// function for title editing
var curTitle = "";
function editTitleOn() {
    curTitle = $.trim($('#page_title').text());
    $('#page_title').text("");
    console.log(curTitle)
    $('#title_edit_frm').show();
    $('#title_txt').val(curTitle);
}
function editTitleOff() {
    // restore current state
    $('#page_title').text(curTitle);
    $('#title_edit_frm').hide();
}
$('#page_title').dblclick(function(event) {
    editTitleOn();
});
$('#btn_edit_title_check').click(function(event) {
    // $('#title_edit_url').val($('#page_url').val());
    if ($('#title_txt').val()) {
        $('#title_edit_frm').submit();
    }else{
        alert("Title text could not be empty.");
    }
});
$('#btn_edit_title_x').click(function(event) {
    editTitleOff();
});

// function for menu editing
$(document).on('click', 'a#add_menu_item', function(event) {
    event.preventDefault();
    $('form#menu_add_frm').show();
    $('a#add_menu_item').hide();
});
$('#btn_add_menu_check').click(function(event) {
    var idx = $('#menu_editable li').length - 1;
    var menuTxt = $('input#nm_item').val()
    $('input#nm_idx').val(idx);

    if (menuTxt.length>0) {
        $('form#menu_add_frm').submit();
    }else{
        alert("empty entry");
    }

    $('form#menu_add_frm').hide();
    $('a#add_menu_item').show();
});
$('#btn_add_menu_x').click(function(event) {
   $('form#menu_add_frm').hide();
   $('a#add_menu_item').show();
});
var minusClicked = 0;
$(document).on('click', 'a#remove_menu_item', function(event) {
    event.preventDefault();
    if (!minusClicked) {
        // $('.nav-page-menu').append('');
        $('.nav-page-menu').parent('li').prepend('<span class="menu-remover-cover shake-rotate"><i class="fa fa-times-circle x-menu-item" style="color:#D50000;"></i></span>');
        $('.menu-remover-cover').click(function(event) {
            if (confirm("Comfirm to delete this menu item and corresponding page?")) {
                $('#rm_item').val($(this).siblings('a').text());
                $('#rm_item_url').val($(this).siblings('a').attr('href'));
                $('#menu_remove_frm').submit();
            }
        });
        minusClicked = 1;
    }else{
        $('.menu-remover-cover').remove();
        $('.x-menu-item').remove();
        minusClicked = 0;
    }
});

// code for side panel editor, need to be initialized before doeument ready
sideEditor = new wysihtml5.Editor('side_wysihtml_editor', {
    toolbar: 'side_wysihtml_toolbar',
    parserRules: wysihtml5ParserRules // defined in file parser rules javascript
});

var isContentChanged = 0;
var sideItem;
var sideIsChanged = 0;
var updateItemId; // id of selected side item
var sideItemUrl; // url for side items on current page
var isNewSideItem = 0;

// setup important values for side panel item on click
$(document).on('click', '.side-panel li.list-hover', function(event) {
    event.preventDefault();
    isNewSideItem = 0
    sideItem = $(this).html();
    setModalValue (sideItem);
    updateItemId = getItemID($(this));
    // sideItemUrl =
    $('#side_delete_item').show();
});

// add side panel item
$(document).on('click', 'li.list-group-item.add-list-item', function(event) {
    event.preventDefault();
    isNewSideItem = 1;
    sideItem = "";
    setModalValue (sideItem);
    $('#side_wysihtml_editor').addClass('expand-modal-editor');
    $('#side_delete_item').hide();
});

function setModalValue (sideItem) {
    $('#side_panel_modal').modal('show');
    sideEditor.setValue(sideItem, true);
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
            // $('#side_create_url').val(updateItemId);
            $('#create_side').submit();
        };
    } else{
        $('#side_create_text').val(updateItem);
        // $('#side_create_url').val(updateItemId);
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
$(document).on('click', '#upload_file', function(event) {
    $('#upload_file_modal').modal('show');
});


jQuery(document).ready(function($) {
    // binding current url
    $('.cur-url').val($('#page_url').val());

    // hide some elements when initialized
    $('#save_changes').hide();
    $('#side_panel_modal').modal('hide');
    $('#upload_file_modal').modal('hide');

    // switch for menu, content text editor and side panel
    $('a#btn_edit_on').click(function(event) {
        $('#btn_edit_on_li').hide()
        $('#btn_edit_off_li').show()
        // page title editing
        editTitleOn();
        // menu item editing
        $('a#add_menu_item').show();
        $('a#remove_menu_item').show();
        // content editing
        openTextEditor();
        // side panel editing
        panelTitleEditOn();
        view2Edit ();
    });
    $('a#btn_edit_off').click(function(event) {
        $('#btn_edit_on_li').show()
        $('#btn_edit_off_li').hide()
        // page title
        editTitleOff();
        // menu
        $('a#add_menu_item').hide();
        $('a#remove_menu_item').hide();
        // content
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
        // side panel
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
        panelTitleEditOff();
        // isContentChanged = 0;
        sideIsChanged=0;
    });

    // global variables
    var txt = $('.editable').html();
    var editor;

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

    $('#side_save_changes').on('click', function(event) {
        event.preventDefault();
        if (isNewSideItem == 0) {
            saveSideItem();
        } else{
            createSideItem();
        };
    });

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

    function onChange() {
        isContentChanged = 1;
    }

    function view2Edit () {
        $('.side-view-mode').show();
        $('.side-edit-mode').hide();
        // prevent to add duplicate " + " button
        if (!$('.side-panel ul.list-group li').hasClass('add-list-item')) {
            $('.side-panel ul.list-group').prepend('<li class="list-group-item add-list-item" title="Add item"><i class="fa fa-plus fa-2"></i></li>')
            $('.side-panel ul.list-group li').addClass('list-hover');
            $('.side-panel ul.list-group li.add-list-item').removeClass('list-hover');
        }
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


    // function for file upload
    $('#btn_upload').click(function(event) {
        $('#img_uploading').show();
        var form_data = new FormData($('#img_upload_frm')[0]);
        $.ajax({
            type: 'POST',
            url: '/uploadajax',
            data: form_data,
            contentType: false,
            processData: false,
            dataType: 'json'
        })
        .done(function(data, textStatus, jqXHR) {
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            console.log("success");
            $('#img_uploading').hide();
            if (data.name == "invalid file") {
                // $('#img_fail_uploading').show();
                $('#upload_console_text').html('<p style="color: #DA2424;"><i class="fa fa-exclamation-triangle"></i>&nbsp;Invalid file!</p>')
            }else{
                // $('#img_done_uploading').show();
                $('#upload_console_text').html('<p style="color: #1B8920;"><i class="fa fa-check-circle-o"></i>&nbsp;Upload successfully!</p>')
            }
        })
        .fail(function() {
            console.log("error");
            $('#img_fail_uploading').show();
        })
        .always(function() {
            console.log("complete");
        });
    });

    $('#img_upload_frm input[type=file]').click(function(event) {
        $('#upload_console_text').empty();
    });
    // end of file upload

    // set side panel switch state


});

// side panel switch
var sideState = $('#side_state').val();
console.log("sideState = "+sideState);
if (sideState=="1") {
    $('#sidepanel_checkbox').bootstrapSwitch('state',true);
    // $('div.side-panel div.panel').show();
}else{
    $('#sidepanel_checkbox').bootstrapSwitch('state',false);
    // $('div.side-panel div.panel').hide();
}

$('#sidepanel_checkbox').on('switchChange.bootstrapSwitch', function(event, state) {
    if (!state) {
        $('#side_panel_state').val(0);
        $('div.side-panel div.panel').hide();
    }else{
        $('#side_panel_state').val(1);
        $('div.side-panel div.panel').show();
    }
    $.ajax({
        url: '/update_side_state',
        type: 'POST',
        data: $('#side_panel_state_frm').serialize(),
    })
    .done(function(data) {
        console.log(data);
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });


    // $('#side_panel_state_frm').submit();
});

// side panel title editing
var curPanelTitle = ""
function panelTitleEditOn() {
    curPanelTitle = $('#panel_title').text();
    $('#panel_title').hide();
    $('#panel_title_edit_span').show();
    $('#panel_title_txt').val(curPanelTitle);
}
function panelTitleEditOff() {
    // restore current state
    $('#panel_title').text(curPanelTitle);
    $('#panel_title').show();
    $('#panel_title_edit_span').hide();
}
$('#panel_heading').dblclick(function(event) {
    panelTitleEditOn();
});

$('#btn_panel_title_check').click(function(event) {
    $('#panel_title_edit_frm').submit();
});
$('#btn_panel_title_x').click(function(event) {
    panelTitleEditOff();
});
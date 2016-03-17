/*
** JavaScript to control home layout behaviours on Litash CMS
** Author: Yichen Lu
*/

// Responsive optimization
(function($) {
    var $window = $(window),
        $html = $('.side-panel');

    // function for setting different text editor for different viewport size
    function resize() {
        if ($window.width() < 640) {
            // small screen
            return $html.removeClass('pull-right');
        }
        // big screen
        $html.addClass('pull-right');
    }

    $window.resize(resize).trigger('resize');
})(jQuery);

// binding current url
$('.cur-url').val($('#page_url').val());

// activate menu item based on url
var url = $('input#page_url').val();
// var splitURL = url.split('/');
// var jointURL = "/"+splitURL[3]+"/"+splitURL[4]+"/"+splitURL[5];
$('#menu-items ul.nav.navbar-nav li a').each(function(index, el) {
    if ($(el).attr('href')==url) {
        $(el).parent('li').addClass('active');
    }
});

// hide some elements when initialized
// $('#save_changes').hide();
$('#side_panel_modal').modal('hide');
$('#upload_file_modal').modal('hide');



// =======================================
// function for title editing
// =======================================
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


// =======================================
// function for menu editing
// =======================================

$(document).on('click', 'a#add_menu_item', function(event) {
    event.preventDefault();
    $('form#menu_add_frm').show();
    $('a#add_menu_item').hide();
});
$('#btn_add_menu_check').click(function(event) {
    var idx = $('#menu_editable li').length - 1;
    var menuTxt = $('input#nm_item').val();
    // var menuTxt4Url = menuTxt.toLowerCase();
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
        $('.nav-page-menu').parent('li').prepend('<span class="menu-remover-cover shake-rotate"><i class="fa fa-times-circle x-menu-item" style="color:#D50000;"></i></span>');
        $('.menu-remover-cover').click(function(event) {
            if (confirm("Comfirm to delete this menu item and corresponding page?")) {
                // if ($('ul#menu_editable li').length == 3) {
                //     alert("This is the last menu item, you can't delete it! Consider to delete this site instead.")
                // }else{
                    $('#rm_item').val($(this).siblings('a').text());
                    $('#rm_item_url').val($(this).siblings('a').attr('href'));
                    $('#menu_remove_frm').submit();
                // }
            }
        });
        minusClicked = 1;
    }else{
        $('.menu-remover-cover').remove();
        $('.x-menu-item').remove();
        minusClicked = 0;
    }
});


// =======================================
// functions for control content text editor
// =======================================

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
    if (isContentChanged()) {
        if (confirm("You have made some changes, cancel without saving?")) {
            $('.editable').hide();
            $('.viewable').show();
            tinymce.get('contetnEditor').setContent($('div.viewable').html());
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
function isContentChanged() {
    var rawViewableTxt = new String($('div.viewable').html());
    var rawEditableTxt = new String(tinymce.get('contetnEditor').getContent());
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
            // $('#update_content').submit();
            updateContentAjax();
        };
    } else{
        // $('#update_content').submit();
        updateContentAjax();
    };
}

$('#cancel_changes').click(function(event) {
    closeTextEditor();
});

function updateContentAjax() {
    // var formData = new FormData();
    // var newContent = new String(tinymce.get('contetnEditor').getContent());
    // var updateURL = new String($('input#update_url').val());
    // formData.append('content', newContent);
    // formData.append('url', updateURL);
    $('#update_text').val(tinymce.get('contetnEditor').getContent());
    console.log($('#update_content').serialize())
    $.ajax({
        url: '/update_content',
        type: 'POST',
        // dataType: 'json',
        data: $('#update_content').serialize()
    })
    .done(function(data) {
        console.log(data);
        console.log("success");
        var res = $.parseJSON(data);

        $('.viewable').html(res.newContent);
        $('.editable').hide();
        $('.viewable').show();
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

}

// =======================================
// code for side panel editor
// =======================================

var sideItem; // current item text
var sideIsChanged = 0;
var updateItemId; // id of selected side item
var sideItemUrl; // url for side items on current page
var isNewSideItem = 0;

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
// side panel switch state recorder
$('#sidepanel_checkbox').on('switchChange.bootstrapSwitch', function(event, state) {
    if (!state) {
        $('#side_panel_state').val(0);
        $('div.side-panel div.panel').hide();
    }else{
        $('#side_panel_state').val(1);
        $('div.side-panel div.panel').show();
    }
    // update state using ajax
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

// code for wysihtml editor in side panel modal and start edit mode
$('a.side-edit-mode').on('click', function(event) {
    event.preventDefault();
    SPView2Edit ();
    $('a.side-view-mode').show();
    $(this).hide();
});

function setModalValue (sideItem) {
    $('#side_panel_modal').modal('show');
    tinymce.get('sideItemEditor').setContent(sideItem);
}

function getItemID (itemDOM) {
    var idTxt = itemDOM.attr('id');
    var id = idTxt.replace("side_item_","");
    return id;
}

// function to detect if there is any changes made
function isSideChanged() {
    sideItem = new String($.trim($('.side-panel li.list-hover').html()));
    var rawViewableTxt = new String(sideItem);
    var rawEditableTxt = new String($.trim(tinymce.get('sideItemEditor').getContent()));
    var viewableTxt = $.trim(rawViewableTxt);
    var editableTxt = $.trim(rawEditableTxt);

    console.log("viewableTxt = "+viewableTxt)
    console.log("editableTxt = "+editableTxt)
    if (editableTxt.length==0){
        console.log("False");
        return false;
    }else if(viewableTxt===editableTxt) {
        console.log("False");
        return false;
    }else{
        console.log("True");
        return true;
    }
}

// function for creating right panel item
function createSideItem() {
    var updateItem = tinymce.get('sideItemEditor').getContent();
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

// function for updating right panel item
function updateSideItem() {
    var updateItem = tinymce.get('sideItemEditor').getContent();
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

// function to switch view mode to edit mode for right panel
function SPView2Edit () {
    $('.side-view-mode').show();
    $('.side-edit-mode').hide();
    // prevent to add duplicate " + " button
    if (!$('.side-panel ul.list-group li').hasClass('add-list-item')) {
        $('.side-panel ul.list-group').prepend('<li class="list-group-item add-list-item" title="Add item"><i class="fa fa-plus fa-2"></i></li>')
        $('.side-panel ul.list-group li').addClass('list-hover');
        $('.side-panel ul.list-group li.add-list-item').removeClass('list-hover');
    }
}

// function to switch edit mode to view mode for right panel
function SPEdit2View () {
    $('.side-edit-mode').show();
    $('.side-view-mode').hide();
    // $('.editable').html(editableTxt);
    $('.side-panel ul.list-group li.add-list-item').remove();
    $('.side-panel ul.list-group li').removeClass('list-hover');
}

function deleteSideItem () {
    if (confirm("Confirm to delete this message?")) {
        $('#side_delete_id').val(updateItemId);
        $('#delete_side').submit();
        console.log(updateItemId)
    };
}


// setup important values for side panel item on click
$(document).on('click', '.side-panel li.list-hover', function(event) {
    event.preventDefault();
    isNewSideItem = 0
    sideItem = new String($.trim($(this).html()));
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
    // $('#side_wysihtml_editor').addClass('expand-modal-editor');
    $('#side_delete_item').hide();
});

// side panel mode ctrl
$('.side-view-mode').on('click', function(event) {
    event.preventDefault();
    // if (isSideChanged()) {
    //     if (confirm("You have made some changes, do you want to save it?")) {
    //         saveContent();
    //         updateSideItem()
    //     } else{
    //         SPEdit2View ();
    //     };
    // }else{
    //     SPEdit2View ();
    // };

    SPEdit2View ();
});

$('#side_save_changes').on('click', function(event) {
    event.preventDefault();
    if (isNewSideItem == 0) {
        updateSideItem();
    } else{
        createSideItem();
    };
});

$('#side_panel_modal').on('hide.bs.modal', function(event) {
    // isSideChanged()
    // if (isSideChanged()) {
    //     if (confirm("You have made some changes, do you want to save?")) {
    //         // updateSideItem();
    //     }else{

    //     }
    // }
    // $('#side_wysihtml_editor').removeClass('expand-modal-editor');
    // tinymce.get('sideItemEditor').setContent(sideItem);
});

$('#side_delete_item').click(function(event) {
    deleteSideItem()
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


// =======================================
// mass edit switch (menu, content text editor and side panel)
// =======================================
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
    SPView2Edit ();
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
    closeTextEditor()
    // side panel
    // if (isSideChanged()) {
    //     if (confirm("You have made some changes, do you want to save it?")) {
    //         saveContent();
    //         updateSideItem()
    //     } else{
    //         SPEdit2View ();
    //     };
    // }else{
    //     SPEdit2View ();
    // };
    SPEdit2View ();
    panelTitleEditOff();
});

// =======================================
// function for file upload
// =======================================

// upload modal trigger
$(document).on('click', '#upload_file', function(event) {
    $('#upload_file_modal').modal('show');
});


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

jQuery(document).ready(function($) {
    // hide some elements when initialized
    $('#view_mode').hide();
    $('#save_changes').hide();

    // global variables
    var txt = $('.editable').html();
    var editor;
    var isChanged = 0;

    // code for wysihtml editor and start edit mode
    $('#edit_mode').on('click', function(event) {
        event.preventDefault();
        $('#save_changes').show();
        var wysihtmlBone = '<div id="wysihtml-toolbar" style="display: none;"> <button class="btn btn-default" data-wysihtml5-command="bold" unselectable="on"><svg width="21" height="21" xmlns="http://www.w3.org/2000/svg"> <path d="M15.232 10.346c-.181-.535-.437-1.005-.767-1.41-.331-.406-.731-.727-1.201-.962-.472-.235-1.002-.355-1.589-.355-.597 0-1.102.118-1.514.354-.412.236-.732.497-.959.777h-.034v-5.25h-2.668v12.764h2.458v-1.099h.032c.26.428.632.757 1.114.987.484.232.996.348 1.541.348.605 0 1.147-.123 1.625-.37.479-.248.883-.578 1.215-.987.328-.412.582-.888.757-1.429.172-.54.26-1.103.26-1.688-.002-.585-.092-1.144-.27-1.68zm-2.425 2.481c-.08.265-.203.499-.365.7-.162.203-.363.367-.602.49-.24.125-.518.187-.832.187-.303 0-.574-.062-.813-.187s-.442-.287-.61-.49c-.168-.201-.298-.434-.39-.69-.093-.26-.139-.524-.139-.795s.045-.533.137-.792c.093-.26.223-.492.39-.693.169-.201.372-.365.61-.488.24-.125.51-.187.813-.187.314 0 .594.062.832.187.237.123.439.283.604.48.162.196.283.426.365.686.08.258.121.521.121.791.002.272-.039.536-.121.801z" fill="#1B2124"></path> </svg></button> <button class="btn btn-default" data-wysihtml5-command="italic" unselectable="on">italic</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="black">black</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red">red</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green">green</button> <button class="btn btn-default" data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue">blue</button> <button class="btn btn-default" data-wysihtml5-command="createLink">insert link</button> <div data-wysihtml5-dialog="createLink" style="display: none;"> <label> Link:<input data-wysihtml5-dialog-field="href" value="http://" class="text"> </label> <button class="btn btn-default" data-wysihtml5-dialog-action="save">OK</button> <button class="btn btn-default" data-wysihtml5-dialog-action="cancel">Cancel</button> </div></div><div id="wysihtml-editor"></div>'
        $('.editable').html(wysihtmlBone)
        editor = new wysihtml5.Editor('wysihtml-editor', {
            toolbar: 'wysihtml-toolbar',
            parserRules: wysihtml5ParserRules // defined in file parser rules javascript
        });
        editor.setValue(txt, true);
        editor.on("change", onChange);

        $('#view_mode').show();
        $(this).hide();
    });

    function onChange() {
        isChanged = 1;
    }

    // mode ctrl
    $('#view_mode').on('click', function(event) {
        event.preventDefault();
        if (isChanged == 1) {
            if (confirm("You have made some changes, do you want to save it?")) {
                saveContent();
            } else{
                $('#edit_mode').show();
                $(this).hide();
                $('.editable').html(txt);
                $('#save_changes').hide();
            };
        }else{
            $('#edit_mode').show();
            $(this).hide();
            $('.editable').html(txt);
            $('#save_changes').hide();
        };
        isChanged = 0;
    });

    // save text functions
    $('#save_changes').on('click', function(event) {
        event.preventDefault();
        saveContent();
    });

    function saveContent() {
        var updateTxt = editor.getValue();
        // $.trim($('#wysihtml-editor').html());
        if (updateTxt=='') {
            if (confirm("You are about to save empty text, are you sure?")) {
                $('#update_text').val(updateTxt);
                $('#update_form').submit();
            };
        } else{
            $('#update_text').val(updateTxt);
            $('#update_form').submit();
        };
    }

});
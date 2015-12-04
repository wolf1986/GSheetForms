$.holdReady(true);
$.getScript('js/GAS/GenericSpreadsheetSvc.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/DateFormat.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/Common.js', function() {$.holdReady(false)});

// Globals
var dicIdToTitle = {};
var gs = {};

$(function() {
    // Load relevant config-script
    var configName = getUrlParameter('Config');

    if(configName != null && configName.length >= 0) {
        // Config file exists
        $.holdReady(true);
        $.getScript('js/GUI/' + configName + '.js', function () {
            $.holdReady(false)
        });
    } else {
        // Initialize manually
        var url_svc = getUrlParameter('urlSvcGsheet');
        var url_sheet = getUrlParameter('url');
        var sheet_form_title = getUrlParameter('formSheetTitle');
        var sheet_title = getUrlParameter('sheetTitle');

        if( null != url_svc &&
            null != url_sheet &&
            null != sheet_form_title &&
            null!= sheet_title ) {

            gs = new GenericSpreadsheetSvc(url_svc);
            gs.sheetUrl = url_sheet;
            gs.sheetTitle = sheet_title;
            gs.sheetTitleProto = sheet_form_title;

            $('#lbl_title').html(gs.sheetTitle);
            document.title = gs.sheetTitle;


            loadDefaultValues();
        }
    }
});

function serializeForm(formObj) {
    var serialized = $(formObj).serializeArray();
    var obj = {};
    $.each(serialized,
        function(i, v) {
            obj[v.name] = v.value;
        });

    return obj;
}

// ----------------------------------
// Event to release page for user
function onFinishedLoadingData() {
    // Signal finish
    $('body').linkify();
    $.unblockUI();
    setMessageWarning("Waiting for your response");
}

// Message Area Handling Functions
function setMessageOk(message) {
    setMessage(message, 'notice success', 'icon-ok-sign icon-large');
}

function setMessageError(message) {
    setMessage(message, 'notice error', 'icon-remove-sign icon-large');
}

function setMessageWarning(message) {
    setMessage(message, 'notice warning', 'icon-warning-sign icon-large');
}

function setMessage(message, mClass, iClass) {
    var m = $('#divMessageNotice');
    var i = m.find('i');

    // Set Classes
    m[0].className = mClass;
    i[0].className = iClass;
    m.find('div').html(message);
}

function myBlockUi() {
    $.blockUI({
        message: $('#divMessageNotice'),
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .9,
            color: '#fff',
            'margin-left': 'auto',
            'margin-right': 'auto',
            width:'60%',
            left: '20%',
            right: '20%'
        }
    });
}

function createLabel(forElement, title) {
    // Load Prototype
    var html_label = '<label>__LABEL__</label>';

    // Replace strings
    html_label = html_label.replace("__LABEL__", title);

    // Replace customized
    var obj = $(html_label);
    obj.attr('for', forElement);

    return obj;
}

function createInput(id, type, attributes, defaultVal, isHistory) {
    // Load Prototype
    var html =
        '<__TAG__ ' +
        'type="__TYPE__" ' +
        'id="__ID_INPUT__" ' +
        'name="__ID_INPUT__" ' +
        'value="__VALUE__" ' +
        '__ATTRIBUTES__' +
        '>__TAG_CLOSE__';

    // Replace strings
    var tag = 'input';
    var tag_close = '';

    if(!type)
        type = 'text';

    if(type == 'textarea') {
        tag = type;
        tag_close = '</' + tag + '>';
    }

    var attributes_html = '';
    if(attributes)
        attributes_html = attributes;

    var type_html = type;
    if(type == 'date')
        type_html = 'text';

    var default_val_html = '';

    if(defaultVal) {
        var match = defaultVal.match(/^js\:(.*)/i);
        if(match) {
            default_val_html = eval(match[1]);
        } else {
            default_val_html = defaultVal;
        }
    }

    if(isHistory) {
        tag = 'select';
        tag_close = '</select>';
    }

    if(id == "") {
        tag = type;
        tag_close = '</' + tag + '>';
    }

    html = html.replace(/__TAG__/g, tag);
    html = html.replace(/__TAG_CLOSE__/g, tag_close);

    html = html.replace(/__ID_INPUT__/g, id);
    html = html.replace(/__TYPE__/g, type_html);
    html = html.replace(/__ATTRIBUTES__/g, attributes_html);
    html = html.replace(/__VALUE__/g, default_val_html);

    // Replace customized
    var obj = $(html);

    if(type == 'date')
        $(obj).datepicker({dateFormat: 'yy-mm-dd'});

	obj.html(default_val_html);
		
    return obj;
}

function createEditButton(selectId) {
    var html_template = '<a class="button small"><i class="icon-pencil"></i></a>';
    var obj = $(html_template);

    obj.click(function(e) {
        e.preventDefault();
        var select = $(document.getElementById(selectId));
        var edit = $(document.getElementById(selectId + '_edit'));
        var btn = $('#' + selectId + '_editButton i');

        if(select[0].style.display == 'inline' || select[0].style.display == '') {
            select[0].style.display = 'none';
            edit[0].style.display = 'inline';

            select.attr('name', '');
            edit.attr('name', selectId);

            btn.removeClass('icon-pencil');
            btn.addClass('icon-book');
        } else {
            select[0].style.display = 'inline';
            edit[0].style.display = 'none';

            select.attr('name', selectId);
            edit.attr('name', '');

            btn.removeClass('icon-book');
            btn.addClass('icon-pencil');
        }
    });

    obj.attr( 'id', selectId + '_editButton');
    obj[0].style.marginBottom = '10px';

    return obj;
}
function prepareGuiFields(guiPrototype) {
    // Define Prototype
    var fieldsPrototype = guiPrototype;

    var i;
    for(i=0; i < guiPrototype.length; i++) {
        var proto = guiPrototype[i];

        var title = proto['title'];
        var id = proto['id'];

        if(id)
            dicIdToTitle[id] = title;

    }

    // Append fields to html
    var main_div = $('#frm_main');

    for(i=0; i < fieldsPrototype.length; i++) {
        var p = fieldsPrototype[i];

        if(p['type'] != 'hidden') {
            main_div.append(
                createLabel(p['id'], p['title'])
            );
        }

        var new_element = createInput(p['id'], p['type'], p['attributes'], p['default'], p['history_enabled']);

        if(p['history_enabled'])
        {
            var container = $('<div></div>').addClass('horizontal_holder2');
            var container_outer = $('<div></div>').addClass('horizontal_holder');
            var edt_select = new_element;
            var edt_input = createInput(p['id'] + '_edit', 'text', p['attributes'], p['default'], false);

            var c1 = container.clone();
            c1[0].style.width = "1px";
            var edt_button = createEditButton(p['id']);
            c1.append(edt_button);

            container_outer.append(c1);

            var c2 = container;
            c2[0].style.width = "100%";
            c2.append(edt_select);

            edt_input.attr('name', '');
            edt_input[0].style.display = 'none';
            c2.append(edt_input);

            container_outer.append(c2);

            new_element = container_outer;
        }

        main_div.append(new_element);

        if(p['history_enabled']) {
            var nc_i = i * 1;
            gs.getValues(gs.sheetUrl, gs.sheetTitle, nc_i + 1, false, true, false)
                .done(function(idP) {
                    return function(res) {
                        appendOptions('#' + idP, res);
                    }
                }(p['id'])
            );

            // Weird UI, looks better after triggering...
            edt_button.trigger('click');
            edt_button.trigger('click');
        }
    }
}

function loadDefaultValues() {
    setMessageWarning("Loading");
    myBlockUi();

    $('#frm_main').html('');

    ajax_requests = [];

    // Prepare UI
    var ajax_obj = gs.getSheetJson(gs.sheetUrl, gs.sheetTitleProto)
        .done(prepareGuiFields)
        .fail( function(res) {
            var o_link = $('<a>')
                .html("See GAS Service Url")
                .attr("href", gs._Url)
                .attr("target", "_blank");

            var o_details = $('<div>')
                .append($('<br />'))
                .append(o_link);

            OnServerResponseAjaxFail(res + o_details.prop('outerHTML'));
        });

    ajax_requests.push(ajax_obj);

    $.when.apply(null, ajax_requests).then(function() {
        onFinishedLoadingData();
    });
}

// Event Handlers
function OnServerResponseSubmit(result) {
    $.unblockUI();
    if (result == true)
        setMessageOk("Saved!");
    else
        OnServerResponseAjaxFail("Unable to submit; Error:" + result);
}

function OnServerResponseAjaxFail(msg) {
    $.unblockUI();
    setMessageError(msg);
}

function testGetTitles() {
    gs.getTitles(ss_url, sheet_title)
        .done(function (res) {
            alert(res);
        });
}

function onSubmit() {
    // Message user
    myBlockUi();
    setMessageWarning("Waiting for Server");

    var frm = $('#frm_main');

    // Form to args object
    var values_frm = serializeForm(frm);

    // Translate values to Svc object
    var values_svc = {};
    for (var k in values_frm) {
        var name = k;
        var title = dicIdToTitle[name];
        values_svc[title] = values_frm[name];
    }

    // Submit data to server
    gs.appendSpreadSheet(gs.sheetUrl, gs.sheetTitle, values_svc)
        .done(OnServerResponseSubmit)
        .fail(OnServerResponseAjaxFail);
}

function appendOptions(obj, options) {
    obj = $(obj);
    options = options.sort();
    for(var i=0; i < options.length; i++) {
        obj.append($('<option>', {value : options[i]}).text(options[i]));
    }
}
//$.holdReady(true);
//$.getScript('js/Common/Common.js', function() {$.holdReady(false)});

//$.holdReady(true);
//$.getScript('js/Common/DateFormat.js', function() {$.holdReady(false)});

//$.holdReady(true);
//$.getScript('js/GAS/GenericSpreadsheetSvc.js', function() {$.holdReady(false)});

$(function() {
    setMessageOk("Ready");
});

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

function onSubmit() {
    // Message user
    myBlockUi();
    setMessageWarning("Waiting for Server");

    var frm = $('#frm_main');

    // Form to args object
    var frm_array = frm.serializeArray();
    var frm_obj = {};

    $.each(frm_array, function(i, v) {
        frm_obj[v.name] = v.value;
    });

    $.ajaxSetup({
        timeout: 5000
    });

    // Submit data to server
    $.post("http://192.168.0.106/command", frm_obj)
        .always(function() {
            $.unblockUI();
        })
        .done(function(data, textStatus, xhr) {
            setMessageWarning('HTTP Status:' + textStatus + ' ==> ' + data);
        })
        .fail(function(data, textStatus, xhr) {
            setMessageError('HTTP Status:' + textStatus + ' ==> ' + data);
        });
}

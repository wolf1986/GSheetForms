$.holdReady(true);
$.getScript('js/GAS/GenericCalendarSvc.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/GAS/GenericSpreadsheetSvc.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/DateFrom.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/DateFormat.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/date.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/Common.js', function() {$.holdReady(false)});

var gTitleTemplate = "__שם__ - ש' __מספר__";
var glNum = '__מספר__';
var glName = '__שם__';

//var gs_cal_url = "https://script.google.com/macros/s/AKfycbzowPJ9ZEg8hI5izRGs3zFfX2kWo0Fro66D-ArjtOUNYHkIrQ/exec";
var gs_cal_url = "https://script.google.com/macros/s/AKfycbyQ9Y6jcXIkNdggKNO4iWQnTanraIgozOBM0_-5zQ/dev"
var gsCal = {};

var gParamLocation;
var gParamCalendarName;
var gParamName;
var gParamSearchTerm = "";

$(function() {
    // Skip if not submitted
    if(getUrlParameter('Submitted') != 'true')
        return;

    gsCal = new GenericCalendarSvc(gs_cal_url);

    if(getUrlParameter('Calendar'))
        gParamCalendarName = getUrlParameter('Calendar');

    if(getUrlParameter('Name'))
        gParamName = getUrlParameter('Name');

    if(getUrlParameter('Location'))
        gParamLocation = getUrlParameter('Location');

    if(getUrlParameter('DeleteSearchTerm'))
        gParamSearchTerm = getUrlParameter('DeleteSearchTerm');

    if(getUrlParameter('DeleteAll') == 'true' &&
        gParamSearchTerm.length > 0) {
        gsCal.deleteEvents(gParamCalendarName, gParamSearchTerm, Date.now().addYears(-10), Date.now().addYears(10));

        return;
    }

// Initialize Service Object
    var gs_url = "https://script.google.com/macros/s/AKfycbxi9At4p1Wo7UnGKC6u7FJI3TM8ng6KJw62yoWPcSF2-BMO4Ts/exec";
    var gsSheet = new GenericSpreadsheetSvc(gs_url);

    gsSheet.Url ='https://docs.google.com/spreadsheets/d/1WkCYhEQ5tG06xA57mKSe6acyxBVWuQHB15YtdNqsVX4/edit#gid=0';
    gsSheet.Title = 'Schedule';

    gsSheet.getSheetJson(
        gsSheet.Url,
        gsSheet.Title
    ).done(onSheetLoaded);

//    gsCal.getEvents(title, pattern, Date.fromString('2014-02-01'), Date.fromString('2015-05-01'))
//        .done(function(res) {
//            console.log(JSON.stringify(res));
//        }
//    );

});

function onSheetLoaded(obj) {
    var lDate = 'תאריך';
    var lHours = 'שעות המפגש';
    var lIndex = 'מספר מפגש';

    events = [];

    for (var i in obj) {
        // Shortcut
        var e = obj[i];
        var ce = {};

        // Parse Date
        var date = Date.fromString(e[lDate], {order: 'DMY'});

        // Parse Hours
        var time_parts = e[lHours].split('-');

        ce['start'] = date.format('yyyy-mm-dd') + ' ' + time_parts[0].trim();
        ce['end'] = date.format('yyyy-mm-dd') + ' ' + time_parts[1].trim();
        ce['title'] = gTitleTemplate;
        ce['title'] = ce['title'].replace(glName, gParamName);
        ce['title'] = ce['title'].replace(glNum, e[lIndex]);
        ce['location'] = gParamLocation;

        events.push(ce);
    }

    gsCal.createEvents(gParamCalendarName, events).then(
        function(res) { console.log(JSON.stringify(res)); }
    );
}

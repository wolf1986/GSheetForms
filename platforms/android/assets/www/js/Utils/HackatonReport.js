//$.holdReady(true);
//$.getScript('js/Common/Common.js', function() {$.holdReady(false)});

//$.holdReady(true);
//$.getScript('js/Common/DateFormat.js', function() {$.holdReady(false)});

//$.holdReady(true);
//$.getScript('js/GAS/GenericSpreadsheetSvc.js', function() {$.holdReady(false)});

window.location;

$.holdReady(true);
$.getScript('js/Common/DateFrom.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/date.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/time.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/GUI/GenericAutoformGui.js', function() {$.holdReady(false)});

// Help "GenericAutoformGui.js"
$(function (){
// Initialize Service Object
    gs = new GenericSpreadsheetSvc("//script.google.com/macros/s/AKfycbw1yGKR5o8WKWNM29-CQRQI6AwLgdnFQBtzoB8y-yr1ABzG3rw/exec");

    gs.sheetUrl ='https://docs.google.com/spreadsheets/d/1UXhQ6Buxf8L6cBZnXkeV9l9WIQUjxfFiQ6cGYgYy9PQ/edit';
    gs.sheetTitle = 'Hackaton';
    gs.sheetTitleProto = 'Hackaton - Form';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;

    loadDefaultValues();
});

// Constants
var lProject = 'אני מצביע לפרוייקט';
var lDescription = 'תיאור מפורט של הפרוייקט';
var lProjectIndex = 'Index';
var lName = 'שם המשתתף';

var cMinDescLength = 5;

function appendProjectDescription(rootElem, rowData) {
    var title = rowData[lProjectIndex] + '. ' + rowData[lProject];
    var e = $("<div>");
    e.append(
        $('<h5>').html(title)
    );

    e.append(
        $('<pre>').html(rowData[lDescription])
    );

    e.append(
        $('<br />')
    );

    rootElem.append(e);
}

$(function() {
//    console.log("Finished Loading");
    setMessageWarning("Loading ...");
    myBlockUi();

    // Get data from table
    var gs_url = "//script.google.com/macros/s/AKfycbw1yGKR5o8WKWNM29-CQRQI6AwLgdnFQBtzoB8y-yr1ABzG3rw/exec";
//    var gs_url = "https://script.google.com/macros/s/AKfycbyyoXcLPT4h66nfz6EmEGPwS81I6SFeSMZ46Hskb8Q/dev";
    var gsSheet = new GenericSpreadsheetSvc(gs_url);

    gsSheet.Url ='https://docs.google.com/spreadsheets/d/1UXhQ6Buxf8L6cBZnXkeV9l9WIQUjxfFiQ6cGYgYy9PQ/edit';
    gsSheet.Title = 'Hackaton';

    gsSheet.getSheetJson(
        gsSheet.Url,
        gsSheet.Title
    ).done(prepareReport);
});


function prepareReport(obj) {
    setMessageWarning("Data Acquired! Preparing Report");

    // List all projects
    var rowNum = 1;
    var idx, row;
    for(idx in obj) {
        if(!obj.hasOwnProperty(idx)) continue;

        row = obj[idx];
        if(row[lDescription].length > cMinDescLength) {
            // Update GUI
            row[lProjectIndex] = rowNum;
            appendProjectDescription($("#tabProjectListing"), row);

            rowNum++;
        }
    }

    // List all Thinkers & Voters
    var dic_thinkers = {};
    var dic_voters = {};

    for(idx in obj) {
        if(!obj.hasOwnProperty(idx)) continue;

        row = obj[idx];

        // Take valid names
        cur_name = row[lName].trim();
        if (cur_name.length > 2) {
            if (row[lDescription] < cMinDescLength) {
                // Count as vote
                if (dic_voters.hasOwnProperty(cur_name))
                    dic_voters[cur_name]++;
                else
                    dic_voters[cur_name] = 1;
            } else {
                // Count as new idea
                if (dic_thinkers.hasOwnProperty(cur_name))
                    dic_thinkers[cur_name]++;
                else
                    dic_thinkers[cur_name] = 1;
            }
        }
    }

    // Update Thinkers & Voters tabs
    Array.prototype.sum = function(){
        if(this.length == 0)
            return 0;

        return this.reduce(function (a, b) {
            return a + b;
        });
    };

    var Values = function(obj) {
        return Object.keys(obj).map(
            function (key) {
                return obj[key];
            }
        );
    };

    var appendTableRow = function(table, rowData) {
        var tr = $("<tr>");
        rowData.forEach(function (value) {
            tr.append($("<td class='center'>").html(value));
        });

        table.append(tr);
    };

    // Thinkers
    var table = $('#tableThinkers');
    var keys = Object.keys(dic_thinkers).sort();
    var i, key;
    for(i = 0; i < keys.length; i++) {
        key = keys[i];
        appendTableRow(table, [key, dic_thinkers[key]]);
    }

    if(dic_thinkers.length > 0) {
        appendTableRow(table, ["", ""]);
        appendTableRow(table, [
            '<strong>סה"כ הצעות</strong>',
            Values(dic_thinkers).sum()
        ]);
        appendTableRow(table, [
            '<strong>סה"כ מציעים</strong>',
            Values(dic_thinkers).length
        ]);
    }

    // Voters
    table = $('#tableVoters');
    keys = Object.keys(dic_voters).sort();
    for(i = 0; i < keys.length; i++) {
        key = keys[i];
        appendTableRow(table, [key, dic_voters[key]]);
    }

    if(dic_voters.length > 0) {
        appendTableRow(table, ["", ""]);
        appendTableRow(table, [
            '<strong>סה"כ הצבעות</strong>',
            Values(dic_voters).sum()
        ]);

        appendTableRow(table, [
            '<strong>סה"כ מצביעים</strong>',
            Values(dic_voters).length
        ]);
    }

    var html_summary = 'סיכום ביניים: באתר העלו _רעיונות_ רעיונות, שאותם הציעו _מציעים_ אנשים. בעד הרעיונות הצביעו _מצביעים_ אנשים (בסה"כ _הצבעות_ הצבעות).';
    html_summary = html_summary.replace("_רעיונות_", Values(dic_thinkers).sum());
    html_summary = html_summary.replace("_מציעים_", Values(dic_thinkers).length);
    html_summary = html_summary.replace("_מצביעים_", Values(dic_voters).length);
    html_summary = html_summary.replace("_הצבעות_", Values(dic_voters).sum());

    $('#divSummary').html(html_summary);

    $('body').linkify();
    $.unblockUI();

    setMessageWarning("Waiting for your response...");
//    $('#divMessageNotice')[0].className = "hide";
    $('#report')[0].className = "grid";
}

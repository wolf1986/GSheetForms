$.holdReady(true);
$.getScript('js/GAS/GenericSpreadsheetSvc.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/DateFrom.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/DateFormat.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/date.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/time.js', function() {$.holdReady(false)});

$.holdReady(true);
$.getScript('js/Common/Common.js', function() {$.holdReady(false)});

function appendTableRow(tableElem, rowData) {
    var row_elem_new = $("<tr>");
    rowData.forEach(function (value) {
        row_elem_new.append($("<td class='center'>").text(value));
    });

    tableElem.append(row_elem_new);
}

$(function() {
    // Get data from table
    var gs_url = "https://script.google.com/macros/s/AKfycbxi9At4p1Wo7UnGKC6u7FJI3TM8ng6KJw62yoWPcSF2-BMO4Ts/exec";
//    var gs_url = "https://script.google.com/macros/s/AKfycbyyoXcLPT4h66nfz6EmEGPwS81I6SFeSMZ46Hskb8Q/dev";
    var gsSheet = new GenericSpreadsheetSvc(gs_url);

    gsSheet.Url ='https://docs.google.com/spreadsheets/d/1rAQMgqK7OoQrK6wiSn-YEm-_UWTYBYafXf65rqMPVgE/edit#gid=860908820';
    gsSheet.Title = 'Expenses - Private';

    gsSheet.getSheetJson(
        gsSheet.Url,
        gsSheet.Title
    ).done(onDataSheetLoaded);
});

function generateReportRow(subject, previousData) {
    var total_distance =
        previousData[subject].distanceLast - previousData[subject].distanceFirst;

    function ParseDateCustom(strDate) {
        // Take first 10 chars
        strDate = strDate.substr(0, 10);

        // Take whatever works
        var date = Date.parseExact(strDate, "yyyy.MM.dd");
        if(date != null)
            return date;
        else
            return Date.parseExact(strDate, "yyyy-MM-dd");
    }

    var dateFirst = ParseDateCustom(previousData[subject].dateFirst);
    var dateLast = ParseDateCustom(previousData[subject].dateLast);

    var period = new TimeSpan(dateLast - dateFirst);

    // Prepare report row
    return [
        subject,
        dateFirst.toString("yyyy.MM.dd"),
        dateLast.toString("yyyy.MM.dd"),
        previousData[subject].countMeasurements,
        previousData[subject].totalCost,
        (previousData[subject].totalLiters).toFixed(2),
        total_distance,
        (total_distance / previousData[subject].totalLiters).toFixed(2),
        (previousData[subject].totalCost / total_distance).toFixed(2)
    ];
}

function onDataSheetLoaded(obj) {
    var lTransport = 'תחבורה';
    var lCategory = 'קטגוריה נקי';
    var lDate = 'מתי';
    var lWilly = 'וילי';
    var lYarden = 'ירדן';
    var lComment = 'הערות';

    function getSubject(comment) {
        if(new RegExp("דלק.*אוטו").test(comment))
            return "דיהאטסו סיריון";

        if(new RegExp("דלק.*אופנוע").test(comment))
            return "הונדה 250";

        return null;
    }

    function getLiters(comment) {
        var res = /(\d+\.?\d+)\s+ל\w*/.exec(comment);
        if(res)
            return res[1];
        else
            return null;
    }

    function getDistance(comment) {
        var res = /(\d+)\s+ק.?מ/.exec(comment);
        if(res)
            return res[1];
        else
            return null;
    }

    var previous_data = {};

    for(var idx in obj) {
        var row = obj[idx];
        if(row[lCategory] == lTransport) {
            var comment = row[lComment];
            var subject = getSubject(comment);

            // Skip non-fuel stuff
            if( subject == null) continue;

            // Extract price & cur_distance data
            var cur_cost = 0;
            if(!isNaN(parseInt(row[lWilly])))
                cur_cost += parseInt(row[lWilly]);

            if(!isNaN(parseInt(row[lYarden])))
                cur_cost += parseInt(row[lYarden]);

            var cur_liters = getLiters(comment);
            var cur_distance = getDistance(comment);

            // When reached invalid rows
            if(!(cur_cost > 0) || !(cur_liters > 0) || !(cur_distance > 0)) {
                // If subject has some data
                if(subject in previous_data) {
                    // If enough data for report
                    if(previous_data[subject].countMeasurements > 1) {
                        var row_data = generateReportRow(subject, previous_data);

                        // Update GUI
                        appendTableRow($("#TableMain").find("tbody"), row_data);
                        var t = 1;
                    }

                    // Reset accumulator
                    delete previous_data[subject];
                }
            } else {
                // Accumulate meters as long as possible
                if (subject in previous_data) {
                    previous_data[subject].totalCost += parseFloat(cur_cost);
                    previous_data[subject].totalLiters += parseFloat(cur_liters);
                    previous_data[subject].countMeasurements += 1;
                    previous_data[subject].distanceLast = parseFloat(cur_distance);
                    previous_data[subject].dateLast = row[lDate];
                } else {
                    previous_data[subject] = {};
                    previous_data[subject].totalCost = 0;
                    previous_data[subject].totalLiters = 0;
                    previous_data[subject].distanceFirst = parseFloat(cur_distance);
                    previous_data[subject].distanceLast = parseFloat(cur_distance);
                    previous_data[subject].dateFirst = row[lDate];
                    previous_data[subject].countMeasurements = 1;
                }
            }
        }
    }

    // Use remaining data if possible
    for(subject in previous_data) {
        if(previous_data[subject].countMeasurements > 1) {
            var row_data = generateReportRow(subject, previous_data);

            // Update GUI
            appendTableRow($("#TableMain").find("tbody"), row_data);
        }
    }
}

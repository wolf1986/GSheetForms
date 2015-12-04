$(function (){
    window.location.replace("https://dl.dropboxusercontent.com/u/823079/GAS_ServicesLatest/HackatonReport.html#tabProjectSubmission");

// Initialize Service Object
    gs = new GenericSpreadsheetSvc("//script.google.com/macros/s/AKfycbw1yGKR5o8WKWNM29-CQRQI6AwLgdnFQBtzoB8y-yr1ABzG3rw/exec");
//    gs = new GenericSpreadsheetSvc("//script.google.com/macros/s/AKfycbz-6jD118XGIqNkIuVxzxlOsdq_0qYx2ip5EOGBU9Q/dev");

    gs.sheetUrl ='https://docs.google.com/spreadsheets/d/1UXhQ6Buxf8L6cBZnXkeV9l9WIQUjxfFiQ6cGYgYy9PQ/edit';
    gs.sheetTitle = 'Hackaton';
    gs.sheetTitleProto = 'Hackaton - Form';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;

    loadDefaultValues();
});
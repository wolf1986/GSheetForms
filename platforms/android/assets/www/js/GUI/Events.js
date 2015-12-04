$(function (){
// Initialize Service Object
    gs = new GenericSpreadsheetSvc("//script.google.com/macros/s/AKfycbw1yGKR5o8WKWNM29-CQRQI6AwLgdnFQBtzoB8y-yr1ABzG3rw/exec");
    gs.sheetUrl ='https://docs.google.com/spreadsheets/d/1HhqwfbOJAiF4quHTX7murw6Q2QDW2H5z4l5hq74Ti-s/edit';
    gs.sheetTitle = 'אישור נוכחות';
    gs.sheetTitleProto = 'אישור נוכחות - טופס';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;

    loadDefaultValues();
});
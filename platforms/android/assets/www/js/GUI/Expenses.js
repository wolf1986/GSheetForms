$(function (){
// Initialize Service Object
    gs = new GenericSpreadsheetSvc("https://script.google.com/macros/s/AKfycbxi9At4p1Wo7UnGKC6u7FJI3TM8ng6KJw62yoWPcSF2-BMO4Ts/exec");
    gs.sheetUrl ='https://docs.google.com/spreadsheets/d/10PbPc8pWGGy5P-dC5wnzfQ_q5gPiOJiuy6aa8YNwUCs/edit';
    gs.sheetTitle = 'Expenses';
    gs.sheetTitleProto = 'Expenses - Form';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;


    loadDefaultValues();
});
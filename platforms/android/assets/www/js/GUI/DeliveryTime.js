$(function (){
// Initialize Service Object
    gs = new GenericSpreadsheetSvc("https://script.google.com/macros/s/AKfycbyyoXcLPT4h66nfz6EmEGPwS81I6SFeSMZ46Hskb8Q/dev");
    gs.sheetUrl ='https://docs.google.com/spreadsheets/d/1RB8E29z4JnjqfmVpUIEuyW9pqQ4qGzht9rLNV17Cdxs/edit#gid=2129075987';
    gs.sheetTitle = 'משלוחים - וילי';
    gs.sheetTitleProto = 'משלוחים - וילי - אפיון טופס';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;


    loadDefaultValues();
});
$(function (){
// Initialize Service Object
    gs = new GenericSpreadsheetSvc("//script.google.com/macros/s/AKfycbxi9At4p1Wo7UnGKC6u7FJI3TM8ng6KJw62yoWPcSF2-BMO4Ts/exec");
    gs.sheetUrl ='//docs.google.com/spreadsheets/d/1RB8E29z4JnjqfmVpUIEuyW9pqQ4qGzht9rLNV17Cdxs/edit#gid=2129075987';
    gs.sheetTitle = 'מדידות';
    gs.sheetTitleProto = 'מדידות - טופס';

    $('#lbl_title').html(gs.sheetTitle);
    document.title = gs.sheetTitle;


    loadDefaultValues();
});
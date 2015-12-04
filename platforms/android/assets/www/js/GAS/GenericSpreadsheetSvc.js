$.holdReady(true);
$.getScript('js/GAS/GoogleService.js', function() {

    GenericSpreadsheetSvc = function(url) {
        var _supportedFunctions = [
            'appendSpreadSheet',
            'getTitles',
            'getSheetJson',
            'getValues'
        ];

        GoogleService.apply(this, [url, _supportedFunctions]);
    };

    GenericSpreadsheetSvc.prototype = Object.create(GoogleService.prototype);
    $.holdReady(false);
});
$.holdReady(true);
$.getScript('js/GAS/GoogleService.js', function() {
    GenericCalendarSvc = function (url) {
        var _supportedFunctions = [
            'createCalendar',
            'getEvents',
            'createEvents',
            'deleteEvents'
        ];

        GoogleService.apply(this, [url, _supportedFunctions]);
    };

    GenericCalendarSvc.prototype = Object.create(GoogleService.prototype);

    $.holdReady(false);
});

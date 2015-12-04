function urldecode(str) {
    return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return urldecode(sParameterName[1]);
        }
    }

    return null;
}
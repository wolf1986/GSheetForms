var app = angular.module('formsConfigurationApp', ['ngSanitize', 'ngCordova']);

app.filter('nonEmptyObj', function() {
    return function(obj) {
        return !obj || Object.keys(obj).length == 0;
    };
});

app.config(function() {
    $.material.init();  // Uses Arrive.js
});

app.controller('controllerFormConfiguration',
    ['$scope', '$http', '$filter', '$cordovaFile', '$cordovaToast',
        function ($scope, $http, $filter, $cordovaFile, $cordovaToast) {

    // Path to config
    var url_config = "config_forms.json";

    // Config Template
    $scope.jsonConfig = {
        forms : {},
        urlSvcGsheet : ''
    };

    // New item template
    $scope.newItem = {};

    $scope.editNewVisible = false;

    $(function() {
        $scope.msgLoading = false;
    });

    $scope.msgError = '';

    $scope.onItemAdd = function() {
        $scope.jsonConfig.forms[$scope.newItem.formKey] = $.extend({}, $scope.newItem.data)
    };

    $scope.onItemDelete = function(key) {
        delete $scope.jsonConfig.forms[key]
    };

    $scope.reloadFromFile = function() {
        $scope.msgAlert = 'Loading Data ...';

        $cordovaFile.readAsText(cordova.file.dataDirectory, url_config)
            .then(function (data) {
                $scope.jsonConfig = angular.fromJson(data);

                $scope.msgAlert = '';
            }, function (error) {
            }
        );
    };

    $scope.onSelectForm = function(key) {
        var url_generic_form = 'GenericAutoformGui.html';

        var params = {
            urlSvcGsheet: $scope.jsonConfig.urlSvcGsheet,
            sheetTitle: key
        };

        $.extend(params, $scope.jsonConfig.forms[key]);

        console.log(JSON.stringify(params));

        var str_params = $.param(params);
        return url_generic_form + '?' + str_params;
    };

    $scope.onSaveChanges = function() {
        $cordovaToast.showShortBottom('Please wait ...');

        $cordovaFile.writeFile(cordova.file.dataDirectory, url_config, JSON.stringify($scope.jsonConfig), true)
            .then(function (success) {
                $cordovaToast.showShortBottom('Saved Successfully !');
            }, function (error) {
                $scope.msgError = "Unable to save date to: " + url_config + "<br />" + error;
            });
    };

    $scope.toggleEditNewVisible = function () {
        $scope.editNewVisible = !$scope.editNewVisible;
    };

    $scope.logToggle = function () {
        $scope.showNgMessage = !$scope.showNgMessage;
    };

    $scope.reloadFromFile();

    $scope.showNgMessage = false;

}]);
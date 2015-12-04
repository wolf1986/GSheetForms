var GAS_LastResult = null;
var GoogleService = function(url, supportedFunctions) {
    this._CallJsonMethod = function(name, args) {
        if(!args)
            args = {};

        // Formalize as HTTP GET request
        var reqId = Math.floor(Math.random() * (10000));
        var varName = "GAS_Result_" + reqId;
        var get_args = {};
        get_args["_req_id"] = reqId;
        get_args["_method"] = name;
        get_args["_args"] = JSON.stringify(args);

        var str_args = $.param(get_args);
        var str_url_get = this._Url + "?" + str_args;

        // Use jquery to request and execute as ajax
        eval(varName + ' = null;');

        var deferred = $.Deferred();
        $.getScript(str_url_get).then(
            function(res) {
                gas_result = eval(varName);
                if(gas_result != null)
                    deferred.resolve(gas_result);
                else
                    deferred.reject(
                        'Error (Res = ' + JSON.stringify(res) + '): (null result) Unsuccessful call to ' + name +
                        ' with args: ' +  JSON.stringify(args)
                    );
            },
            function(res) {
                deferred.reject(
                    'Error (Res = ' + JSON.stringify(res) + '): Unsuccessful call to ' + name +
                        ' with args: ' +  JSON.stringify(args)
                );
            }
        );

        return deferred.promise();
    };

    this._UpdateFunctions = function(supportedFunctions) {
        if(supportedFunctions)
            this._SupportedFunctions = supportedFunctions;

        var o = this;
        $.each(this._SupportedFunctions, function(k, v) {
            o[v] = function() {
                return o._CallJsonMethod(v, $.makeArray(arguments));
            }
        });
    };

    this._Url = url;
    this._SupportedFunctions = [];
    this._UpdateFunctions(supportedFunctions);
};
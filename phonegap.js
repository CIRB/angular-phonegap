(function () {
    'use strict';
    var readyPromise,
        device,
        deferred,
        timeoutID;

    function devicereadyCallback() {
        if (!device) {
            device = window.device || {};
            device.desktop = false;
            device.ios = device.platform === 'iOS';
            device.android = device.platform === 'Android';

            deferred.resolve(device);
            clearTimeout(timeoutID);
        }
    }

    angular.module('irisnet.phonegap', [])
    .run(['$q', '$window', function ($q, $window) {
        device = null;
        deferred = $q.defer();

        document.removeEventListener("deviceready", devicereadyCallback, false); // if already binded
        document.addEventListener("deviceready", devicereadyCallback, false);

        timeoutID = setTimeout(function() {
            if (!device) {
                device = {};
                device.desktop = true;
                device.ios = false;
                device.android = false;
                deferred.resolve(device);
            }
        }, 5000);

        readyPromise = deferred.promise;

    }]).factory('deviceready', ["$q", function ($q) {

        return function () {
            if (device) {
                var deferred = $q.defer();
                deferred.resolve(device);
                return deferred.promise;
            } else {
                return readyPromise;
            }
        };
    }]).factory('currentPosition', ['$q', 'deviceready',
            function ($q, deviceready) {

        return function (options) {
            var deferred = $q.defer();

            deviceready().then(function () {
                navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(position);

                }, function (error) {
                    deferred.reject(error);
                }, options || {
                    timeout: 10000,
                    maximumAge: 600000
                });

            });
            return deferred.promise;
        };
    }]).factory('localeName', ['$q', 'deviceready',
            function ($q, deviceready) {

        return function (allowedLanguage) {
            var deferred = $q.defer();
            deviceready().then(function (device) {

                if (device.desktop) {
                    deferred.resolve(resolveLanguage(navigator.language, allowedLanguage));
                } else {
                    navigator.globalization.getLocaleName(
                        function (locale) {
                            deferred.resolve(resolveLanguage(locale.value, allowedLanguage));
                        }, function (error) {
                            deferred.reject(error);
                        }
                    );
                }
            });
            return deferred.promise;
        };
    }]);

    function resolveLanguage (lang, allowedLanguage) {
        lang = lang.split(/[_-]+/)[0].toLowerCase();

        if (!allowedLanguage || allowedLanguage.indexOf(lang) >= 0) {
            return lang;
        }
        return null;
    }
})();

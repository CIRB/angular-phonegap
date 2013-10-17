(function () {
    'use strict';
    var deferred_ready = null;

    angular.module('irisnet.phonegap', [])
    .factory('deviceready', ['$rootScope', '$q', function ($rootScope, $q) {

        if (!deferred_ready) {
            deferred_ready = $q.defer();
            angular.element(document).bind('deviceready', function () {
                var device = navigator.device || {};
                device.desktop = typeof window.cordova === 'undefined';
                device.ios = !device.desktop && device.platform === 'iOS';
                device.android = !device.desktop && device.platform === 'Android';

                deferred_ready.resolve(device);
            });
        }

        return function () {
            return deferred_ready.promise;
        };
    }]).factory('currentPosition', ['$q', 'deviceready','$rootScope',
            function ($q, deviceready, $rootScope) {

        var errorMessages = {
            1: 'Your GPS is probably deactivated or unavailable',
            2: 'Unable to get geo location',
            3: 'Timeout to get geo location'
        };
        return function () {
            var deferred = $q.defer();

            deviceready().then(function () {
                navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(position);

                }, function (error) {
                    var reason = errorMessages[error.code];
                    deferred.reject(reason);
                }, {
                    timeout:10000,
                    maximumAge: 600000
                });

            });
            return deferred.promise;
        };
    }]).factory('localeName', ['$q', 'phonegapReady', 'device', '$rootScope',
            function ($q, phonegapReady, device, $rootScope) {

        var resolveLang = function (lang) {
            lang = lang.split(/[_-]+/)[0];
            if(lang !== 'nl' && lang !== 'fr'){
                lang ="fr";
            }
            return lang;
        };
        return function () {
            var deferred = $q.defer();
            deviceready().then(function (device) {

                if (Constant.isDesktop()) {
                    deferred.resolve(resolveLang(navigator.language));
                } else {
                    navigator.globalization.getLocaleName(
                        function (language) {
                            deferred.resolve(resolveLang(language.value));
                        }, function () {
                            deferred.reject('Error getting language');
                        }
                    );
                }
            });
            return deferred.promise;
        };
    }]);
})();

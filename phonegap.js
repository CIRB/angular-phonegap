(function () {
    'use strict';
    var deferred_ready = null;

    angular.module('irisnet.phonegap', [])
    .run(['$window', function ($window) {
        var self = this;

        this.$ready = $q.defer();
        this.isReady = false;
        angular.element($window.document).bind('deviceready', function () {
            self.device = navigator.device || {};
            self.device.desktop = false;
            self.device.ios = !self.device.desktop && device.platform === 'iOS';
            self.device.android = !self.device.desktop && device.platform === 'Android';

            this.isReady = true;
            this.$ready.resolve(self.device);
        });
        setTimeout(function() {
            if (!self.isReady && !navigator.device && !window.cordova) {
                device.desktop = true;
                device.ios = false;
                device.android = false;
                deferredReady.resolve($window.device);
            }
        }, 5000);
    }])
    .factory('deviceready', ['$rootScope', '$q', function ($rootScope, $q) {
        return function () {
            return this.$ready.promise;
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

        function resolveLang (lang) {
            lang = lang.split(/[_-]+/)[0].toLowerCase();
            if(lang !== 'nl' && lang !== 'fr'){
                lang ="fr";
            }
            return lang;
        };
        return function () {
            var deferred = $q.defer();
            deviceready().then(function (device) {

                if (device.desktop) {
                    deferred.resolve(resolveLang(navigator.language));
                } else {
                    navigator.globalization.getLocaleName(
                        function (locale) {
                            deferred.resolve(resolveLang(locale.value));
                        }, function (error) {
                            deferred.reject(error);
                        }
                    );
                }
            });
            return deferred.promise;
        };
    }]);
})();

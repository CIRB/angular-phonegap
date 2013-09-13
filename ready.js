(function () {
    'use strict';
    var defered = null;

    angular.module('irisnet.phonegap', []).
        factory('phonegapReady', function ($rootScope, $q) {

        if (!defered) {
            defered = $q.defer();
            angular.element(document).bind('deviceready', function () {
                $rootScope.$apply(defered.resolve());
            });
        }

        return function () {
            return defered.promise;
        };
    });
})();

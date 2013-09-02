/*
 * angular-phonegap-ready v0.0.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */


angular.module('btford.phonegap.ready', []).
factory('phonegapReady', function ($rootScope) {
    'use strict';
    var deviceready = false;
    angular.element(document).bind('deviceready', function () {
        deviceready = true;
    });
    return function (fn) {
        var queue = [];

        var impl = function () {
            queue.push(Array.prototype.slice.call(arguments));
        };

        if (!deviceready) {
            angular.element(document).bind('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            });
        } else {
            impl = fn;
        }

        return function () {
            return impl.apply(this, arguments);
        };
    };
});

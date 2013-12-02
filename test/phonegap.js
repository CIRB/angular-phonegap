var $rootScope, deviceready, localeName, currentPosition;

function fireDeviceReady () {
    var event = document.createEvent('Events');
    event.initEvent('deviceready');
    document.dispatchEvent(event);

    $rootScope.$apply();
}


describe('Phonegap Mobule for Angular', function () {

    beforeEach(module('irisnet.phonegap'));
    beforeEach(inject( function(_$rootScope_, _deviceready_, _localeName_, _currentPosition_){
        $rootScope = _$rootScope_;
        deviceready = _deviceready_;
        localeName = _localeName_;
        currentPosition = _currentPosition_;
    }));

    it('should catch deviceready event', function () {
        var processed = false;
        runs(function() {
            window.device = { platform: 'iOS' };
            deviceready().then(function (device) {
                expect(device.desktop).toBe(false);
                expect(device.ios).toBe(true);
                expect(device.android).toBe(false);
                processed = true;
            });
            fireDeviceReady();
        });

        waitsFor(function() {
            return processed;
        }, "event fired", 1000);
    });

    it('should deviceready fallback after timeout', function () {
        var processed = false;
        runs(function() {
            deviceready().then(function (device) {
                expect(device.desktop).toBe(true);
                processed = true;
            });
            setTimeout(function() {
                $rootScope.$apply();
            }, 5100);
        });

        waitsFor(function() {
            return processed;
        }, "timeout", 8000);
    });

    it('should should get current position', function () {
        navigator.geolocation = {};
        navigator.geolocation.getCurrentPosition = function (callback) {
            callback({x:123, y:456});
        };
        var processed = false;
        runs(function() {
            currentPosition().then(function (position) {
                expect(position.x).toBe(123);
                expect(position.y).toBe(456);
                processed = true;
            });
            fireDeviceReady();
        });

        waitsFor(function() {
            return processed;
        }, "promise resolved", 1000);
    });

    it('should find device language if allowed', function () {
        var processed = 0,
            locale,
            localeValues = [
                ['fr_fr', 'fr'],
                ['FR-be', 'fr'],
                ['nl',    'nl'],
                ['EN-us', null]
            ];

        function testLocale (locale, allowed, expected) {
            navigator.globalization = {};
            navigator.globalization.getLocaleName = function (callback, fallback) {
                callback({value: locale});
            };

            localeName(allowed).then(function (language) {
                expect(language).toBe(expected);
                processed += 1;
                return language;
            });
        }

        runs(function() {

            for (var i in localeValues) {
                locale = localeValues[i];
                testLocale(locale[0], ['fr', 'nl'], locale[1]);
                fireDeviceReady();
            }
        });

        waitsFor(function() {
            return processed === localeValues.length;
        }, "all tests done", 2000);
    });
});


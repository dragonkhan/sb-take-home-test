'use strict';

angular.module('myApp.filters')

    .filter('timefilter', [function () {
        return function (time) {
            var result = null;
            if (time && time.hour >= 0 && time.minute >= 0) {
                var meridiem = "AM";
                var hour = time.hour;
                var minute = time.minute;
                if (hour > 11) {
                    meridiem = "PM";
                    hour -= 12;
                }
                if (hour == 0) {
                    hour = 12;
                }
                var hourString = hour;
                var minuteString = minute;
                if (hour < 10) {
                    hourString = "0" + hour;
                }
                if (minute < 10) {
                    minuteString = "0" + minute;
                }
                result = hourString + ":" + minuteString + " " + meridiem;
            }
            return result;
        };
    }]);

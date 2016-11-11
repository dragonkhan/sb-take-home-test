'use strict';
angular.module("myApp").controller("MainController", [function () {
    var $ctrl = this;
    $ctrl.timeZones = ['America/Los_Angeles', 'America/New_York'];
    $ctrl.order = {
        requestedDatetime: null,
        timeZone: $ctrl.timeZones[0]
    };
    $ctrl.order2 = {
        requestedDatetime: moment.tz([2016, 11, 12, 12, 15], $ctrl.timeZones[0]).toDate(),
        timeZone: $ctrl.timeZones[0]
    };
    $ctrl.changeTimeZone = function (order) {
        if (order.timeZone == $ctrl.timeZones[0]) {
            order.timeZone = $ctrl.timeZones[1];
        } else {
            order.timeZone = $ctrl.timeZones[0];
        }
    };
    $ctrl.changeDateTime = function (order) {
        var month = getRandomInt10();
        var date = getRandomInt10(2) + 1;
        var hour = getRandomInt10(2);
        var dateMoment = moment.tz([2017, month, date, hour, 15], order.timeZone);
        $ctrl.lastDateLabel = dateMoment.format();
        order.requestedDatetime = dateMoment.toDate();
    };
    function getRandomInt10(multiplier) {
        multiplier = multiplier || 1;
        return Math.round(Math.random() * 10) * multiplier;
    }

    //
    var now = moment();
    $ctrl.beforeRenderDate = function (day) {
        var isDisabled = true;
        if (day.year > now.year()) {
            isDisabled = false;
        } else if (day.year == now.year()) {
            if (day.month > now.month()) {
                isDisabled = false;
            } else if (day.month == now.month() && day.date >= now.date()) {
                isDisabled = false;
            }
        }
        day.isDisabled = isDisabled;
    };
    //
    var startTimeWkd = {hour: 7, minute: 0};
    var endTimeWkd = {hour: 19, minute: 45};
    var startTimeWke = {hour: 10, minute: 0};
    var endTimeWke = {hour: 15, minute: 45};
    //
    $ctrl.beforeRenderTime = function (time, date) {
        var isDisabled = true;
        //
        var hour = time.hour;
        var minute = time.minute;
        //
        var dayOfWeek = date.getDay();
        //weekday
        var start = startTimeWkd;
        var end = endTimeWkd;
        //weekend
        if (dayOfWeek == 0 || dayOfWeek == 6) {
            start = startTimeWke;
            end = endTimeWke;
        }
        //
        var startNum = start.hour * 100 + start.minute;
        var endNum = end.hour * 100 + end.minute;
        var timeNum = hour * 100 + minute;
        if (timeNum >= startNum && timeNum <= endNum) {
            isDisabled = false;
        }
        time.isDisabled = isDisabled;
    };
    $ctrl.formatOrderDate = function (order) {
        var result = "";
        if (order && order.requestedDatetime) {
            var date = order.requestedDatetime;
            result = moment.tz(date, order.timeZone).format();
        }
        return result;
    }
}]);
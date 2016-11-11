'use strict';
angular.module('myApp.components')
    .component('datepicker', {
            templateUrl: "components/datepicker/datepicker.html",
            bindings: {
                ngModel: "=",
                sbBeforeRenderItem: "="
            },
            controller: [function () {
                var $ctrl = this;
                $ctrl.$onInit = function () {
                    $ctrl.weekDayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
                    $ctrl.isDatePickerMenuVisible = false;
                    $ctrl.curMonth = moment();
                    //
                    refreshCalendarWeeks();
                };
                $ctrl.$doCheck = function () {
                    if ($ctrl.ngModel != $ctrl.previousNgModel) {
                        $ctrl.previousNgModel = $ctrl.ngModel
                        if ($ctrl.ngModel == null) {
                            $ctrl.curMonth = moment();
                            $ctrl.inputLabel = null;
                        } else {
                            $ctrl.curMonth = moment($ctrl.ngModel);
                            $ctrl.inputLabel = moment($ctrl.ngModel).format('dddd, MMMM Do, YYYY')
                        }
                        refreshCalendarWeeks();
                    }
                };
                //
                $ctrl.nextMonth = function () {
                    $ctrl.curMonth.add(1, "months");
                    refreshCalendarWeeks();
                };
                $ctrl.prevMonth = function () {
                    $ctrl.curMonth.subtract(1, "months");
                    refreshCalendarWeeks();
                };
                //
                function refreshCalendarWeeks() {
                    var curMonth = $ctrl.curMonth;
                    var start = curMonth.clone().startOf('month').startOf('week');
                    var end = curMonth.clone().endOf('month').endOf('week');
                    var cur = start;
                    //
                    var week = [];
                    var weeks = [];
                    //
                    while (cur.isSameOrBefore(end)) {
                        var monthNum = cur.month();
                        var dayNum = cur.format("DD");
                        // day object
                        var day = {date: dayNum, month: monthNum, year: cur.year()};
                        // set disabled
                        var beforeRenderItem = $ctrl.sbBeforeRenderItem || defaultBeforeRenderItem;
                        beforeRenderItem(day);
                        //
                        week.push(day);
                        if (week.length == 7) {
                            weeks.push(week);
                            week = [];
                        }
                        cur.add(1, "days");
                    }
                    $ctrl.weeks = weeks;
                }

                function defaultBeforeRenderItem() {
                }

                $ctrl.selectDay = function (day) {
                    if (!day.isDisabled) {
                        $ctrl.ngModel = $ctrl.curMonth.clone().month(day.month).date(day.date).toDate();
                        $ctrl.toggleDatePickerMenu();
                    }
                };
                $ctrl.toggleDatePickerMenu = function () {
                    $ctrl.isDatePickerMenuVisible = !$ctrl.isDatePickerMenuVisible;
                };
            }]
        }
    );

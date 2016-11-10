'use strict';
angular.module('myApp.components')
    .directive('datepicker', [function () {
        return {
            templateUrl: "components/datepicker/datepicker.html",
            restrict: "E",
            replace: true,
            scope: {
                ngModel: "=",
                sbBeforeRenderItem: "="
            },
            controller: ["$scope", function ($scope) {
                $scope.weekDayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
                $scope.isDatePickerMenuVisible = false;
                $scope.curMonth = moment();
                refreshCalendarWeeks();
                //
                $scope.nextMonth = function () {
                    $scope.curMonth.add(1, "months");
                    refreshCalendarWeeks();
                };
                $scope.prevMonth = function () {
                    $scope.curMonth.subtract(1, "months");
                    refreshCalendarWeeks();
                };
                //
                function refreshCalendarWeeks() {
                    var curMonth = $scope.curMonth;
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
                        var beforeRenderItem = $scope.sbBeforeRenderItem || defaultBeforeRenderItem;
                        beforeRenderItem(day);
                        //
                        week.push(day);
                        if (week.length == 7) {
                            weeks.push(week);
                            week = [];
                        }
                        cur.add(1, "days");
                    }
                    $scope.weeks = weeks;
                }

                function defaultBeforeRenderItem() {
                }

                $scope.selectDay = function (day) {
                    if (!day.isDisabled) {
                        $scope.ngModel = $scope.curMonth.clone().month(day.month).date(day.date).toDate();
                        $scope.toggleDatePickerMenu();
                    }
                };
                $scope.$watch("ngModel", function (newVal, oldVal) {
                    if ($scope.ngModel == null) {
                        $scope.curMonth = moment();
                        $scope.inputLabel = null;
                    } else {
                        $scope.curMonth = moment($scope.ngModel);
                        $scope.inputLabel = moment($scope.ngModel).format('dddd, MMMM Do, YYYY')
                    }
                    refreshCalendarWeeks();
                });
                //
                $scope.toggleDatePickerMenu = function () {
                    $scope.isDatePickerMenuVisible = !$scope.isDatePickerMenuVisible;
                };
            }]
        }
    }]);

'use strict';

angular.module('myApp.components')
    .directive('timepicker', [function () {
        return {
            templateUrl: "components/timepicker/timepicker.html",
            restrict: "E",
            replace: true,
            scope: {
                date: "=",
                isDateRequired: "=",
                ngModel: "=",
                sbBeforeRenderItem: "="
            },
            controller: ["$scope", function ($scope) {
                var watchers = [];
                $scope.isTimePickerMenuVisible = false;
                //
                var AM = 'AM';
                var PM = 'PM';
                $scope.meridiems = [AM, PM];
                $scope.selectedMeridiem = AM;
                //
                var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                var minutes = [0, 15, 30, 45];
                var timesPerRow = 4;
                var amTimesRows = [];
                var pmTimesRows = [];

                function refreshTimes() {
                    amTimesRows = [];
                    pmTimesRows = [];
                    var timesRow = [];
                    //
                    if (!$scope.isDateRequired || $scope.date != null) {
                        $scope.meridiems.forEach(function (meridiem) {
                            hours.forEach(function (hour) {
                                minutes.forEach(function (minute) {
                                    var hour24 = meridiem == PM ? hour + 12 : hour;
                                    var hour12 = hour;
                                    if (hour == 0) {
                                        hour12 = 12;
                                    }
                                    // time object
                                    var time = {
                                        hour: hour24,
                                        hour12: hour12,
                                        minute: minute,
                                        meridiem: meridiem
                                    };
                                    // set disabled
                                    var beforeRenderItem = $scope.sbBeforeRenderItem || defaultBeforeRenderItem;
                                    beforeRenderItem(time, $scope.date);
                                    //
                                    timesRow.push(time);
                                    //
                                    if (timesRow.length == timesPerRow) {
                                        if (meridiem == AM) {
                                            amTimesRows.push(timesRow);
                                        } else {
                                            pmTimesRows.push(timesRow);
                                        }
                                        timesRow = [];
                                    }
                                });
                            });
                        });
                        setTimeRows();
                    }
                }

                function setTimeRows() {
                    if ($scope.selectedMeridiem == AM) {
                        $scope.timesRows = amTimesRows;
                    } else {
                        $scope.timesRows = pmTimesRows;
                    }
                }

                function defaultBeforeRenderItem() {
                }

                refreshTimes();

                $scope.setMeridiem = function (value) {
                    $scope.selectedMeridiem = value;
                    setTimeRows();
                };

                watchers.push($scope.$watch("date", function (newVal, oldVal) {
                    onDateTimeChange();
                }));
                watchers.push($scope.$watch("ngModel", function (newVal, oldVal) {
                    onDateTimeChange();
                    //
                    if ($scope.ngModel) {
                        if ($scope.ngModel.hour > 11) {
                            $scope.setMeridiem(PM);
                        } else {
                            $scope.setMeridiem(AM);
                        }
                    }
                }));
                function onDateTimeChange() {
                    refreshTimes();
                    //
                    if ($scope.isDateRequired && !$scope.date) {
                        $scope.ngModel = null;
                    } else {
                        invalidateTimeIfNeeded();
                    }
                }

                function invalidateTimeIfNeeded() {
                    var time = $scope.ngModel;
                    var date = $scope.date;
                    // set time to null if it's disabled
                    if (time && $scope.sbBeforeRenderItem && date) {
                        var timeCopy = angular.copy(time);
                        //
                        $scope.sbBeforeRenderItem(timeCopy, date);
                        //
                        if (timeCopy.isDisabled) {
                            $scope.ngModel = null;
                        }
                    }
                }

                //
                $scope.selectTime = function (time) {
                    if (!time.isDisabled) {
                        $scope.ngModel = {hour: time.hour, minute: time.minute};
                        $scope.toggleTimePickerMenu();
                    }
                };
                //
                $scope.toggleTimePickerMenu = function () {
                    if (!$scope.isDateRequired && $scope.date == null) {
                        $scope.isTimePickerMenuVisible = false;
                    } else {
                        $scope.isTimePickerMenuVisible = !$scope.isTimePickerMenuVisible;
                    }
                };
                $scope.$on('$destroy', function () {
                    while (watchers.length) {
                        watchers.shift()();
                    }
                });
            }]
        }
    }]);

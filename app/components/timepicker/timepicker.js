'use strict';

angular.module('myApp.components')
    .component('timepicker', {
        templateUrl: "components/timepicker/timepicker.html",
        bindings: {
            date: "=",
            isDateRequired: "=",
            ngModel: "=",
            sbBeforeRenderItem: "="
        },
        controller: [function () {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.isTimePickerMenuVisible = false;
                //
                $ctrl.AM = 'AM';
                $ctrl.PM = 'PM';
                $ctrl.meridiems = [$ctrl.AM, $ctrl.PM];
                $ctrl.selectedMeridiem = $ctrl.AM;
                //
                $ctrl.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                $ctrl.minutes = [0, 15, 30, 45];
                $ctrl.timesPerRow = 4;
                $ctrl.amTimesRows = [];
                $ctrl.pmTimesRows = [];
                //
                refreshTimes();
            };

            $ctrl.$doCheck = function () {
                if ($ctrl.date != $ctrl.prevDate) {
                    $ctrl.prevDate = $ctrl.date;
                    onDateTimeChange();
                }
                if ($ctrl.ngModel != $ctrl.prevNgModel) {
                    $ctrl.prevNgModel = $ctrl.ngModel;
                    onDateTimeChange();
                    //
                    if ($ctrl.ngModel) {
                        if ($ctrl.ngModel.hour > 11) {
                            $ctrl.setMeridiem($ctrl.PM);
                        } else {
                            $ctrl.setMeridiem($ctrl.AM);
                        }
                    }
                }
            };

            function refreshTimes() {
                $ctrl.amTimesRows = [];
                $ctrl.pmTimesRows = [];
                var timesRow = [];
                //
                if (!$ctrl.isDateRequired || $ctrl.date != null) {
                    $ctrl.meridiems.forEach(function (meridiem) {
                        $ctrl.hours.forEach(function (hour) {
                            $ctrl.minutes.forEach(function (minute) {
                                var hour24 = meridiem == $ctrl.PM ? hour + 12 : hour;
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
                                var beforeRenderItem = $ctrl.sbBeforeRenderItem || defaultBeforeRenderItem;
                                beforeRenderItem(time, $ctrl.date);
                                //
                                timesRow.push(time);
                                //
                                if (timesRow.length == $ctrl.timesPerRow) {
                                    if (meridiem == $ctrl.AM) {
                                        $ctrl.amTimesRows.push(timesRow);
                                    } else {
                                        $ctrl.pmTimesRows.push(timesRow);
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
                if ($ctrl.selectedMeridiem == $ctrl.AM) {
                    $ctrl.timesRows = $ctrl.amTimesRows;
                } else {
                    $ctrl.timesRows = $ctrl.pmTimesRows;
                }
            }

            function defaultBeforeRenderItem() {
            }

            $ctrl.setMeridiem = function (value) {
                $ctrl.selectedMeridiem = value;
                setTimeRows();
            };

            function onDateTimeChange() {
                refreshTimes();
                //
                if ($ctrl.isDateRequired && !$ctrl.date) {
                    $ctrl.ngModel = null;
                } else {
                    invalidateTimeIfNeeded();
                }
            }

            function invalidateTimeIfNeeded() {
                var time = $ctrl.ngModel;
                var date = $ctrl.date;
                // set time to null if it's disabled
                if (time && $ctrl.sbBeforeRenderItem && date) {
                    var timeCopy = angular.copy(time);
                    //
                    $ctrl.sbBeforeRenderItem(timeCopy, date);
                    //
                    if (timeCopy.isDisabled) {
                        $ctrl.ngModel = null;
                    }
                }
            }

            //
            $ctrl.selectTime = function (time) {
                if (!time.isDisabled) {
                    $ctrl.ngModel = {hour: time.hour, minute: time.minute};
                    $ctrl.toggleTimePickerMenu();
                }
            };
            //
            $ctrl.toggleTimePickerMenu = function () {
                if (!$ctrl.isDateRequired && $ctrl.date == null) {
                    $ctrl.isTimePickerMenuVisible = false;
                } else {
                    $ctrl.isTimePickerMenuVisible = !$ctrl.isTimePickerMenuVisible;
                }
            };
        }]
    });

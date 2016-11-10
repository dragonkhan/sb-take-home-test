'use strict';
angular.module('myApp.components')
    .directive('dateTimePicker', [function () {
        return {
            templateUrl: "components/date-time-picker/date-time-picker.html",
            restrict: "E",
            replace: true,
            scope: {
                ngModel: "=",
                sbBeforeRenderDateItem: "=",
                sbBeforeRenderTimeItem: "=",
                sbTimeZone: "@"
            },
            controller: ["$scope", "$timeout", function ($scope, $timeout) {
                $scope.$watch("ngModel", function (newVal, oldVal) {
                    if (!isInnerUpdate) {
                        if (newVal && oldVal) {
                            if (!moment(newVal).isSame(moment(oldVal))) {
                                initInnerModel();
                            }
                        } else {
                            initInnerModel();
                        }
                    }
                });
                initInnerModel();

                function initInnerModel() {
                    if ($scope.ngModel) {
                        var dateMoment;
                        if ($scope.sbTimeZone) {
                            dateMoment = moment.tz($scope.ngModel, $scope.sbTimeZone);
                        } else {
                            dateMoment = moment($scope.ngModel);
                        }
                        //
                        $scope.date = moment([dateMoment.year(), dateMoment.month(), dateMoment.date()]).toDate();
                        $scope.time = {hour: dateMoment.hour(), minute: dateMoment.minute()};
                    }
                }
                //
                var isModelDirty = false;
                //
                $scope.$watch("sbTimeZone", function (newVal, oldVal) {
                    onDateTimeChange();
                });
                $scope.$watch("date", function (newVal, oldVal) {
                    onDateTimeChange();
                });
                $scope.$watch("time", function (newVal, oldVal) {
                    onDateTimeChange();
                });
                function onDateTimeChange() {
                    isModelDirty = true;
                    $scope.$evalAsync(function () {
                        if (isModelDirty) {
                            isModelDirty = false;
                            updateModel();
                        }
                    });
                }
                //
                var isInnerUpdate = false;
                //
                function updateModel() {
                    var time = $scope.time;
                    var date = $scope.date;
                    //
                    isInnerUpdate = true;
                    //
                    if (date && time) {
                        var tzArray = getTzArray(date, time);
                        var newDateMoment = $scope.sbTimeZone ? moment.tz(tzArray, $scope.sbTimeZone) : moment(date).hour(time.hour).minute(time.minute);
                        //
                        if (!$scope.ngModel || !newDateMoment.isSame(moment($scope.ngModel))) {
                            $scope.ngModel = newDateMoment.toDate();
                        }
                    } else {
                        $scope.ngModel = null;
                    }
                    $timeout(function () {
                        isInnerUpdate = false;
                    });
                }

                function getTzArray(date, time) {
                    var tzArray = [date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute];
                    return tzArray;
                }
            }]
        }
    }]);

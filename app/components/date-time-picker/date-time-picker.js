'use strict';
angular.module('myApp.components')
    .component('dateTimePicker',
        {
            templateUrl: "components/date-time-picker/date-time-picker.html",
            bindings: {
                ngModel: "=",
                sbBeforeRenderDateItem: "=",
                sbBeforeRenderTimeItem: "=",
                sbTimeZone: "<"
            },
            controller: [function () {
                var $ctrl = this;
                $ctrl.$onInit = function () {
                    initInnerModel();
                };
                $ctrl.$doCheck = function () {
                    if ($ctrl.ngModel && $ctrl.prevNgModel) {
                        if (!moment($ctrl.ngModel).isSame(moment($ctrl.prevNgModel))) {
                            $ctrl.prevNgModel = $ctrl.ngModel;
                            initInnerModel();
                        }
                    } else {
                        $ctrl.prevNgModel = $ctrl.ngModel;
                        initInnerModel();
                    }
                    var isModelDirty = false;
                    if ($ctrl.sbTimeZone != $ctrl.prevSbTimeZone) {
                        $ctrl.prevSbTimeZone = $ctrl.sbTimeZone;
                        isModelDirty = true;
                    }
                    if ($ctrl.date != $ctrl.prevDate) {
                        $ctrl.prevDate = $ctrl.date;
                        isModelDirty = true;
                    }
                    if ($ctrl.time != $ctrl.prevTime) {
                        $ctrl.prevTime = $ctrl.time;
                        isModelDirty = true;
                    }
                    if (isModelDirty) {
                        updateModel();
                    }
                };
                function initInnerModel() {
                    if ($ctrl.ngModel) {
                        var dateMoment;
                        if ($ctrl.sbTimeZone) {
                            dateMoment = moment.tz($ctrl.ngModel, $ctrl.sbTimeZone);
                        } else {
                            dateMoment = moment($ctrl.ngModel);
                        }
                        //
                        $ctrl.date = moment([dateMoment.year(), dateMoment.month(), dateMoment.date()]).toDate();
                        $ctrl.time = {hour: dateMoment.hour(), minute: dateMoment.minute()};
                    }
                }

                //
                function updateModel() {
                    var time = $ctrl.time;
                    var date = $ctrl.date;
                    //
                    if (date && time) {
                        var tzArray = getTzArray(date, time);
                        var newDateMoment = $ctrl.sbTimeZone ? moment.tz(tzArray, $ctrl.sbTimeZone) : moment(date).hour(time.hour).minute(time.minute);
                        //
                        if (!$ctrl.ngModel || !newDateMoment.isSame(moment($ctrl.ngModel))) {
                            $ctrl.ngModel = newDateMoment.toDate();
                        }
                    } else {
                        $ctrl.ngModel = null;
                    }
                }

                function getTzArray(date, time) {
                    var tzArray = [date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute];
                    return tzArray;
                }
            }]
        });

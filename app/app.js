'use strict';

angular.module("myApp.components", []);
angular.module("myApp.filters", []);
// Declare app level module which depends on views, and components
angular.module("myApp", ["myApp.components", "myApp.filters"]).config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');

}]).run(function(){
    moment.tz.add([
        'America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0',
        'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
    ]);
});

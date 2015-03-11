angular.module("mask", []);
angular.module("mask").directive('mask', ['$timeout', 'maskService', function($timeout, maskService) {
   return {
     require: 'ngModel',
     scope: {
        mask: "@"
     },
     link: function(scope, element, attrs, ctrl) {
         var execute = function () {
             scope.$apply(function () {
                 ctrl.$setViewValue(maskService.maskNumber(ctrl.$modelValue, scope.mask));
                 ctrl.$render();
             });
         };
         element.bind('keyup', function () {
             execute();
         });
         
         $timeout(function () { 
             execute();
         }, 100);
      }
   };
}]);
angular.module("mask").factory("maskService", [function () {
    var _otherCharacters = /[^0-9]/g;

    var _applyMask = function (string, mask) {
        var formatedString = "";
        var startAt = 0;
        var sectors = mask.split(/[\(\)\.\-\/\s]/g);
        var sectorsSize = 0;
        var separators = mask.replace(/[^\(\)\.\-\/\s]/g, "").split("");
        for (var i = 0; i < sectors.length; i++) {
            formatedString += string.substring(startAt, startAt + sectors[i].length);
            sectorsSize += sectors[i].length;
            if (string.length < sectorsSize + 1) return formatedString;
            if (i < sectors.length - 1) formatedString += separators[i];
            startAt += sectors[i].length;
        }
        return formatedString;
    }
    
    var _removeCharacters = function (string) {
        return string.replace(_otherCharacters, '');
    };

    var _maskNumber = function (string, mask) {
        if (!string) return string;
        return _applyMask(_removeCharacters(string), mask);
    };
    
    return {
        maskNumber: _maskNumber
    };
}]);
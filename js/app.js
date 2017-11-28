var app = angular.module("beautySolutions", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/main.html"
        })
        .when("/event", {
            templateUrl: "views/event.html",
            controller: 'eventCtrl'
        })
        .when("/event/:eventId", {
            templateUrl: "views/event.html",
            controller: 'eventCtrl'
        });
});

app.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});
app.controller("mainCtrl", ['$scope', '$http', '$rootScope', '$route', '$routeParams', function ($scope, $http, $routeParams) {
    
    function removeExtraQuotes(value) {
        if (value.length > 0 && value[0] == '"' && value[value.length - 1] == '"') {
            value = value.slice(1, value.length - 1);
            removeExtraQuotes(value);
        }
        return value;
    }

    function matchEventField(fieldArr, event) {
        if (fieldArr.length > 0) {
            var fieldName = fieldArr[0];
            var fieldValue = '';

            //split description paragraphs at array, not string
            if (fieldArr.length > 2) {
                fieldValue = fieldArr.slice(1);
                //delete quotes at the start and the end of string (specific of text-unicode converter)
                fieldValue.forEach(function (part, index) {
                    fieldValue[index] = removeExtraQuotes(part);
                });
            } else if (fieldArr.length == 2) {
                fieldValue = fieldArr[1];
                fieldValue = removeExtraQuotes(fieldValue);
            }

            event[fieldName] = fieldValue;
        }
        return event;
    }

    function parseEventStr(eventStr) {
        var event = {};
        //split all event info into pairs field-value
        var fieldsStrArr = eventStr.split(/\r\n/);
        fieldsStrArr.forEach(function (fieldStr) {
            //split pair field-value in different parts
            var fieldArr = fieldStr.split(/\t/);
            //delete all empty values in array
            fieldArr = fieldArr.filter(Boolean);
            event = matchEventField(fieldArr, event);
        });
        return event;
    }

    function getStringFromChars(string) {
        var str = "";
        // var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

        // var stringUpd = string.replace("\", "\\");
        // var charArr = decodeURIComponent( escape(string ) );
        // var newStr = string.trim();
        var charCode = "";
        // string.forEach(function (item) {
        //     if(item == '\'){
        //         }
        // })
        // return str;
    }

    function parseEventsFile() {
        $http.get('content/events/events.txt').then(function (response) {
            var events = [];
            var data = response.data;
            // if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
            //     data = getStringFromChars(data);
            // }
            //split all info into string info for each event
            var eventsStrArray = data.split("<---------->");
            eventsStrArray.forEach(function (eventStr) {
                var event = parseEventStr(eventStr);
                events.push(event);
            });
            $scope.$parent.mainEvent = $.grep(events, function (e) {
                return e.id == 'main-event';
            })[0];
            $scope.$parent.leftEvent = $.grep(events, function (e) {
                return e.id == 'left-event';
            })[0];
            $scope.$parent.rightEvent = $.grep(events, function (e) {
                return e.id == 'right-event';
            })[0];
            var constantEvents = $.grep(events, function (e) {
                return e.id != 'main-event' && e.id != 'left-event' && e.id != 'right-event';
            });
            $scope.$parent.events = events;
            //split all constant events in groups to display them in rows by three
            $scope.$parent.eventsSets = [];
            for (i = 0, j = constantEvents.length; i < j; i += 3) {
                $scope.$parent.eventsSets.push(constantEvents.slice(i, i + 3));
            }
        });
    }

    $scope.getDateName = function (dateStr) {
        var monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        if (dateStr != null && dateStr != undefined) {
            var dateArr = dateStr.split('.');
            if (dateArr.length > 1) {
                var day = dateArr[0];
                var month = monthNames[dateArr[1] - 1];
                return day + " " + month;
            }
        }
        return dateStr;
    };

    parseEventsFile();

}]);

app.controller("menuCtrl", function ($scope) {
    $scope.activeMenuId = 'header-link';

    $scope.scrollTo = function (hash) {
        document.querySelector("#" + hash).scrollIntoView({
            behavior: 'smooth'
        });
        $scope.activeMenuId = hash + "-link";
    }
});

app.controller("galleryCtrl", function ($scope) {
    var view = $("#photosViewer");
    var move = "72vw";
    var sliderLimit = -216;

    function pxToVw(value) {
        return value * (100 / document.documentElement.clientWidth);
    }


    $scope.rightArrowClick = function () {
        var currentPosition = pxToVw(parseInt(view.css("left")));
        if (currentPosition >= sliderLimit) {
            view.stop(false, true).animate({left: "-=" + move}, {duration: 400});
            $("#galleryLeftArrow").removeClass("inactive");
        } else {
            $("#galleryRightArrow").addClass("inactive");
        }
    };

    $scope.leftArrowClick = function () {
        var currentPosition = pxToVw(parseInt(view.css("left")));
        if (currentPosition < 0) {
            view.stop(false, true).animate({left: "+=" + move}, {duration: 400});
            $("#galleryRightArrow").removeClass("inactive");
        } else {
            $("#galleryLeftArrow").addClass("inactive");
        }
    };
});

app.controller("eventCtrl", function ($scope, $routeParams) {
    $scope.event = $.grep($scope.events, function (e) {
        return e.id == $routeParams.eventId;
    })[0];

    $scope.updateMainPhoto = function (clickedId) {
        var curElement = $("#" + clickedId);
        var mainElement = $("#mainPhoto");

        var mainBg = mainElement.css('background-image');

        mainElement.css('background-image', curElement.css('background-image'));
        curElement.css('background-image', mainBg);

    };
});
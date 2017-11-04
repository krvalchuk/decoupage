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

    function parseEventsFile() {
        $http.get('content/events/events.txt').then(function (response) {
            var events = [];
            //split all info into string info for each event
            var eventsStrArray = response.data.split("<---------->");
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

app.controller("mainEventCtrl", function ($scope) {
    $scope.makeEventSmaller = function (id) {
        $('#' + id).addClass('little-event');
    };

    $scope.makeEventOrigin = function (id) {
        $('#' + id).removeClass('little-event');
    };
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
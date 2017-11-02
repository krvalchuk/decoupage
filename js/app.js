var app = angular.module("beautySolutions", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/main.html"
        })
        .when("/event", {
            templateUrl: "views/event.html"
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
app.controller("mainCtrl", function ($scope, $http) {

    function matchEventField(fieldArr, event) {
        if (fieldArr.length > 0) {
            var fieldName = fieldArr[0];
            var fieldValue = '';

            if (fieldArr.length > 2) {
                fieldValue = fieldArr.slice(1);
            } else if (fieldArr.length == 2) {
                fieldValue = fieldArr[1];
            }
            event[fieldName] = fieldValue;
        }
        return event;
    }

    function parseEventStr(eventStr) {
        var event = {};
        var fieldsStrArr = eventStr.split(/\r\n/);
        fieldsStrArr.forEach(function (fieldStr) {
            var fieldArr = fieldStr.split(/\t/);
            fieldArr = fieldArr.filter(Boolean);
            event = matchEventField(fieldArr, event);
            var i = 0;
        });
        return event;
    }

    function parseEventsFile() {
        $http.get('content/events/events.txt').then(function (response) {
            var events = [];
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
            $scope.$parent.eventsSets = [];
            for (i = 0, j = constantEvents.length; i < j; i += 3) {
                $scope.$parent.eventsSets.push(constantEvents.slice(i, i + 3));
            }
        });
    }

    parseEventsFile();
});

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
app.controller("eventsCtrl", function ($scope, $rootScope) {

    $scope.setEventId = function (eventId) {
        $rootScope.eventId = eventId;
        $rootScope.event = $.grep($scope.events, function (e) {
            return e.id == $rootScope.eventId;
        })[0];
        $rootScope.$apply();
    };

    $scope.updateMainPhoto = function (clickedId) {
        var curElement = $("#" + clickedId);
        var mainElement = $("#mainPhoto");

        var mainBg = mainElement.css('background-image');

        mainElement.css('background-image', curElement.css('background-image'));
        curElement.css('background-image', mainBg);

    };

    // $scope.sidePhotosVisible = $rootScope.eventId != "craquelure-glass";
});
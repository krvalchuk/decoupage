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
app.controller("eventsCtrl", function ($scope) {

    var eventSet1 = [
        {
            "imageName": "tshirt-event.jpg",
            "description": "Роспись ткани <br/> акриловыми красками"
        },
        {
            "imageName": "picture-event.jpg",
            "description": "Знакомство с декупажем <br/> Ключница"
        },
        {
            "imageName": "mandala-event.jpg",
            "description": "Плетение индейской мандалы <br/> Ojos de dios"
        }
    ];
    var eventsSet2 = [
        {
            "imageName": "glass-event.jpg",
            "description": "Стаканчик с кракелюром"
        },
        {
            "imageName": "clock-event.jpg",
            "description": "Секреты лаковой распечатки <br/> Часы"
        },
        {
            "imageName": "jewelbox-event.jpg",
            "description": "Декупаж шкатулок, <br/> часов, ключниц, кухонных досок"
        }
    ];

    $scope.eventsSets = [eventSet1, eventsSet2];
});
app.controller("eventCtrl", function ($scope) {
    $scope.event = {
        "title": "Роспись ткани <br/> акриловыми красками",
        "duration": "2-3 часа",
        "cost": "200",
        "audience": "для взрослых и детей от 8 лет",
        "descriptionSet": ["Декорируем текстильную эко-сумку или футболку",
            "На мастер-классе мы разберем, как правильно выбирать ткань, рисунок и другие материалы для росписи. Вы научитесь применять одну из техник переноса изображения на ткань и распишите ткань акриловыми красками.",
            "Приходите и откройте в себе настоящего художника!"],
        "photosUrl": ["rospis-akrilom"]
    };

    $scope.updateMainPhoto = function (clickedId) {
        var curElement = $("#" + clickedId);
        var mainElement = $("#mainPhoto");

        var mainBg = mainElement.css('background-image');

        mainElement.css('background-image', curElement.css('background-image'));
        curElement.css('background-image', mainBg);
    }
});
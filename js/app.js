var app = angular.module("beautySolutions", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/main.html"
        })
        .when("/event", {
            templateUrl : "views/event.html"
        });
});

app.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
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
    $scope.event={
        "title":"Роспись ткани <br/> акриловыми красками",
        "duration":"2-3 часа",
        "cost":"200",
        "audience":"для взрослых и детей от 8 лет",
        "descriptionSet":["Декорируем текстильную эко-сумку или футболку",
            "На мастер-классе мы разберем, как правильно выбирать ткань, рисунок и другие материалы для росписи. Вы научитесь применять одну из техник переноса изображения на ткань и распишите ткань акриловыми красками.",
            "Приходите и откройте в себе настоящего художника!"]
    }
});
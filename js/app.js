var app = angular.module("beautySolutions", []);
app.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);
app.controller("eventsController", function ($scope) {
    
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
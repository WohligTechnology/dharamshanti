// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload'
]);

firstapp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "views/template.html",
            controller: 'HomeCtrl'
        })
        .state('movies', {
            url: "/movies",
            templateUrl: "views/template.html",
            controller: 'MoviesCtrl'
        })
        .state('awards', {
            url: "/",
            templateUrl: "views/template.html",
            controller: 'AwardsCtrl'
        })
        .state('dharma-tv', {
            url: "/dharma-tv/",
            templateUrl: "views/template.html",
            controller: 'DharmaTvCtrl'
        })
        .state('dharma-tvsearch', {
            url: "/dharma-tv/:search",
            templateUrl: "views/template.html",
            controller: 'DharmaTvCtrl'
        })
        .state('tv-inside', {
            url: "/tv-inside/:id",
            templateUrl: "views/template.html",
            controller: 'TvInsideCtrl'
        })
        .state('dharma-world', {
            url: "/dharma-world",
            templateUrl: "views/template.html",
            controller: 'DharmaWorldCtrl'
        })
        .state('news-events', {
            url: "/news-events",
            templateUrl: "views/template.html",
            controller: 'NewsEventsCtrl'
        })
        .state('dharma-journey', {
            url: "/dharma-journey",
            templateUrl: "views/template.html",
            controller: 'DharmaJourneyCtrl'
        })
        .state('contact-us', {
            url: "/contact-us",
            templateUrl: "views/template.html",
            controller: 'ContactUsCtrl'
        })
        .state('news-detail', {
            url: "/news-detail/:id",
            templateUrl: "views/template.html",
            controller: 'NewsDetailCtrl'
        })
        .state('movie-inside', {
            url: "/movie-inside/:id",
            templateUrl: "views/template.html",
            controller: 'MovieInsideCtrl'
        })
        .state('overview', {
            url: "/overview",
            templateUrl: "views/template.html",
            controller: 'OverviewCtrl'
        })
        .state('dharma140', {
            url: "/dharma140",
            templateUrl: "views/template.html",
            controller: 'Dharma140Ctrl'
        });
    $urlRouterProvider.otherwise("/home");
    $locationProvider.html5Mode(isproduction);
});
firstapp.filter('uploadpath', function() {
    return function(input, width, height, style) {
        var other = "";
        if (width && width != "") {
            other += "&width=" + width;
        }
        if (height && height != "") {
            other += "&height=" + height;
        }
        if (style && style != "") {
            other += "&style=" + style;
        }
        if (input) {
            if (input.indexOf('https://') == -1) {
                return imgpath + "?file=" + input + other;

            } else {
                return input;
            }
        }
    };
});
firstapp.filter('wallpaperpath', function() {
    return function(input, width, height, style) {
        var other = "";
        if (width && width != "") {
            other += "&width=" + width;
        }
        if (height && height != "") {
            other += "&height=" + height;
        }
        if (style && style != "") {
            other += "&style=" + style;
        }
        if (input) {
            if (input.indexOf('https://') == -1) {
                return imgurl + "wallpaper" + "?file=" + input + other;

            } else {
                return input;
            }
        }
    };
});
firstapp.filter('shorten', function() {
    return function(value, limit) {
        if (value)
            if (value.length < limit) {
                return value;
            } else {
                return value.slice(0, limit - 2) + "..";

            }

    }
})
firstapp.directive('uploadImage', function($http, $filter) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback"
        },
        link: function($scope, element, attrs) {
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function(n) {
                        $scope.image.push({
                            url: $filter("uploadpath")(n)
                        });
                    });
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function() {
                $scope.model = [];
            };
            $scope.uploadNow = function(image) {
                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function(data) {
                    console.log("success");
                    if ($scope.callback) {
                        $scope.callback(data);
                    } else {
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            $scope.model = data.data[0];
                        }
                    }
                });
            };
        }
    };
});
firstapp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

firstapp.directive('img', function($compile, $parse) {
    return {
        restrict: 'E',
        replace: false,
        link: function($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function() {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});
firstapp.directive('fancybox', function($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attrs) {
            $element = $(element);
            setTimeout(function() {
                $(".various").fancybox({
                    maxWidth: 800,
                    maxHeight: 600,
                    fitToView: false,
                    width: '70%',
                    height: '70%',
                    autoSize: false,
                    closeClick: false,
                    openEffect: 'none',
                    closeEffect: 'none'
                });
            }, 100);
        }
    };
});
firstapp.directive('autoHeight', function($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attrs) {
            var $element = $(element);
            var windowHeight = $(window).height();
            var addHeight = function() {
                $element.css("min-height", windowHeight);
            };
            addHeight();
        }
    };
});
firstapp.directive('autoHeightfixed', function($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attrs) {
            var $element = $(element);
            var windowHeight = $(window).height() - 20;
            var addHeight = function() {
                $element.css("height", windowHeight);
            };
            addHeight();
        }
    };
});
firstapp.directive('fancyboxBox', function($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function(scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                closeBtn: true,
                helpers: {
                    media: {}
                }
            });
        }
    };
});
firstapp.filter('youtubethumb', function() {
    return function(input, onlyid) {
        if (input) {
            return "http://img.youtube.com/vi/"+input+"/hqdefault.jpg";
        }
    };
});
firstapp.directive('scrolldown', function($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attrs) {
            var $element = $(element);
            // var windowHeight = $(window).height();
            $scope.scrollDown = function() {
                $('html,body').animate({
                        scrollTop: $(".second").offset().top
                    },
                    'slow');

            }

        }
    };
});
firstapp.directive('scrollToItem', function() {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function(scope, $elm, attr) {

            $elm.on('click', function() {
                $('html,body').animate({
                    scrollTop: $(scope.scrollTo).offset().top
                }, "slow");
            });
        }
    }
});

firstapp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

firstapp.config(function($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});

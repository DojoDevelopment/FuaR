//ngRoute is for $routeProvider
//routeStyles is for individual css pages in each partial
//ngMessages is for form validation
var app = angular.module('myApp', ['ngRoute', 'routeStyles', 'ngMessages']);
var req_login, userLevel, verification, user;

app.config(function($routeProvider, $sceDelegateProvider){

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://v88_fuar.s3.amazonaws.com/**'
    ]);

    $routeProvider
    //index page for non logged in users
    .when('/', {
        templateUrl: '/partials/landing.html',
        controller:  'LandingController',
        css: 'css/splash.css',
        data: { login : false }

    //going to try to combine this page with landing.html
    }).when('/register', {

        templateUrl: '/partials/register.html',
        controller: 'LandingController',
        css: 'css/splash.css',
        data: { login : false }

    //topic page
    }).when('/dashboard', {

        templateUrl: '/partials/dashboard.html',
        controller: 'DashboardController',
        css: 'css/secondary.css',
        data: { login : true }

    //add topic
    }).when('/topic/add', {

        templateUrl: '/partials/topic_add.html',
        controller: 'AlterTopicController',
        css: 'css/secondary.css',
        data: { login : true }

    //view topic
    }).when('/topic/:id', {

        templateUrl: '/partials/topic_view.html',
        controller: 'TopicController',
        css: 'css/secondary.css',
        data: { login : true }

    //user profile
    }).when('/user/:id', {

        templateUrl: '/partials/profile.html',
        controller: 'UserController',
        css: 'css/secondary.css',
        data: { login : true }

    //admin settings
    }).when('/settings', {

        templateUrl: '/partials/settings.html',
        controller: 'SettingsController',
        css: 'css/secondary.css',
        data: { login : true }

    //route to root index
    }).otherwise({
        redirectTo: '/',
    });

}).run(function ($rootScope, $location, $http, UserFactory) {

  // //on load
  $rootScope.$on('$routeChangeStart', function (event, next, current) {

    if (next && next.$$route && next.$$route.data){

      //verify if login is true or user_level is greater than 0
      verification = next.$$route.data.login;

      if ($rootScope.user !== undefined){

        //if verification is true and user isn't set send them to login
        if ( verification && $rootScope.user === undefined ) {
          console.log('Error A0103: Access Denied');
          $location.path('/');
        }

      } else {
        UserFactory.check_session(function(){

          //if verification is true and user isn't set send them to login
          if ( verification && $rootScope.user === undefined ) {
            console.log('Error A0102: Access Denied');
            $location.path('/');
          }
        });
      }
    } else {
      console.log('Error A0101: Access Denied');
      $location.path('/');
    }
  });
});
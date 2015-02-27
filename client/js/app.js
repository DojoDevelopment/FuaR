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
        data: {
            login : false
            , userLevel : 0
        }

    //going to try to combine this page with landing.html
    }).when('/register', {

        templateUrl: '/partials/register.html',
        controller: 'LandingController',
        css: 'css/splash.css',
        data: {
            login : false
            , userLevel : 0
        }

    //topic page
    }).when('/dashboard', {

        templateUrl: '/partials/dashboard.html',
        controller: 'DashboardController',
        css: 'css/secondary.css',
        data: {
            login : true
            , userLevel : 1
        }

    //add topic
    }).when('/topic/add', {

        templateUrl: '/partials/topic_add.html',
        controller: 'AlterTopicController',
        css: 'css/secondary.css',
        data: {
            login : true
            , userLevel : 1
        }

    //view topic
    }).when('/topic/:id', {

        templateUrl: '/partials/topic_view.html',
        controller: 'TopicController',
        css: 'css/secondary.css',
        data: {
            login : true
            , userLevel : 1
        }

    //user profile
    }).when('/user/:id', {

        templateUrl: '/partials/profile.html',
        controller: 'UserController',
        css: 'css/secondary.css',
        data: {
            login : true
            , userLevel : 1
        }

    //admin settings
    }).when('/settings', {

        templateUrl: '/partials/settings.html',
        controller: 'SettingsController',
        css: 'css/secondary.css',
        data: {
            login : true
            , userLevel : 1
        }
    //route to root index
    }).otherwise({
        redirectTo: '/',
    });

}).run(function ($rootScope, $location) {

  // //on load
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next && next.$$route && next.$$route.data){
      //get login and user_level requirement and set variables
      req_login = next.$$route.data.login;
      userLevel = next.$$route.data.userLevel;

      //verify if login is true or user_level is greater than 0
      verification = ( req_login || userLevel > 0 ? true : false );

      user = {
          user_level : $rootScope.user.user_level
        , graduation : $rootScope.user.graduation
        , file_name  : $rootScope.user.file_name
        , name       : $rootScope.user.name
        , id         : $rootScope.user.user_id
      }

console.log(user);

      //if verification is true and user isn't set send them to login
      if ( verification && $rootScope.user === undefined ) {
        console.log('Error A0101: Access Denied')
        $location.path('/');
      //verification is true and user is set do further checks
      } else if (verification && $rootScope.user !== undefined) {

        //check if user_id is a number else send them the login
        if ( req_login && !RegExp(/^[0-9]*$/).test($rootScope.user.id) ) {
          console.log('Error A0102')
          $location.path('/');
        }

        //check user_level is higher than required level else send them to dashboard
        if ( $rootScope.user.user_level < userLevel ){
          console.log('Error A0103')
          $location.path('/dashboard');
        }
      }
    } else {
      $location.path('/');
    }
  });
});
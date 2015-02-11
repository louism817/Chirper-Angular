var app = angular.module('chirperApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/mytweets', {
        templateUrl: '/app/views/MyTweets.html',
        controller: 'LocalUserController'
    })
    .when('/timeline', {
        templateUrl: '/app/views/TimelineView.html',
        controller: 'FriendsController'
    })


    .otherwise({
        redirectTo: '/'
    });
});
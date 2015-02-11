app.controller("FriendsController", function ($scope, FriendsService) {
    $scope.friends = [];
    $scope.timelineTweets = [];

    $scope.friends = FriendsService.loadFriends();

    //FriendsService.loadFriends().then(function (data) {
    //    //deferred.resolve()
    //    $scope.friends = data;
    //}, function () {
    //    //deferred.reject()
    //    console.log('Friends did not load');
    //});

    $scope.timelineTweets = FriendsService.loadTimelineTweets();

    $scope.addTweet = function () {
        FriendsService.addTweet($scope.tweetText).then(function (data) {
            //deferred.resolve()
            $scope.timelineTweets = data;
        }, function () {
            //deferred.reject()
            console.log('Did not add tweet');
        });
    }

    $scope.deleteTweet = function (tweet) {
        FriendsService.deleteTweet(tweet).then(function (data) {
            //deferred.resolve()
            $scope.timelineTweets = data;
        }, function () {
            //deferred.reject()
            console.log('Did not add tweet');
        });
    }

    var updateUser = function () {
        FriendsService.updateUser($scope.name, $scope.location, $scope.photo).then(function (data) {
            //deferred.resolove()
            $user = data;
        }, function () {
            //deferred.reject()
            console.log('Did nod update');
        });
    }

    $scope.showFewerTweets = function () {
        //deferred.resolve()
        $scope.timelineTweets = FriendsService.showFewerTweets();
    }

    $scope.showAllTweets = function () {
        //deferred.resolve()
        $scope.timelineTweets = FriendsService.showAllTweets();
    }
});
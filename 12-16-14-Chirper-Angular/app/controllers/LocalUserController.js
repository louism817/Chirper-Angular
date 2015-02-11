app.controller("LocalUserController", function ($scope, LocalUserService) {
    $scope.user = {
     };
    $scope.userTweets = [];

    LocalUserService.loadUser().then(function (data) {
        //deferred.resolve()
        $scope.user = data;
    }, function () {
        //deferred.reject()
        console.log('User did not load');
    });

    LocalUserService.loadUserTweets().then(function (data) {
        //deferred.resolve()
        $scope.userTweets = data;
    }, function () {
        //deferred.reject()
        console.log('User tweets did not load');
    });

    $scope.addTweet = function () {
        LocalUserService.addTweet($scope.tweetText).then(function (data) {
            //deferred.resolve()
            $scope.userTweets = data;
        }, function () {
            //deferred.reject()
            console.log('Did not add tweet');
        });
    }

    $scope.deleteTweet = function (tweet) {
        LocalUserService.deleteTweet(tweet).then(function (data) {
            //deferred.resolve()
            $scope.userTweets = data;
        }, function () {
            //deferred.reject()
            console.log('Did not add tweet');
        });
    }

    $scope.updateUser = function () {
        LocalUserService.updateUser($scope.name, $scope.location, $scope.photo).then(function (data) {
            //deferred.resolove()
            $user = data;
        }, function () {
            //deferred.reject()
            console.log('Did nod update');
        });
    }

    $scope.showFewerTweets = function () {
        //deferred.resolve()
        $scope.userTweets = LocalUserService.showFewerTweets();
    }

    $scope.showAllTweets = function () {
        //deferred.resolve()
        $scope.userTweets = LocalUserService.showAllTweets();
    }


});
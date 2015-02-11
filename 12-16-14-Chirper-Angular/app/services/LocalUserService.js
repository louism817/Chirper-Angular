app.factory('LocalUserService', function ($http, $q) {
    var user = {};
    var userTweets = [];
    var baseurl = 'https://chirperlouism.firebaseio.com/';

    var showFewerTweets = function () {
        if (userTweets.length > 5) {
            var lessTweets = userTweets.slice((userTweets.length -5), userTweets.length);
            return lessTweets;
        }
        
    }

    var showAllTweets = function () {
        return userTweets;
    }


    // Load user profile from database
    var loadUser = function () {
        var deferred = $q.defer();

        $http({
            url: baseurl + 'profile/.json',
            method: 'GET'
        }).success(function (data) {
            for (var m in data) {
                user = data[m];
                user.id = m;
            }
            deferred.resolve(user);
        }).error(function () {
            deferred.reject();
        });
        
        return deferred.promise;
    }

    var loadUserTweets = function () {
        var deferred = $q.defer();

        $http({
            url: baseurl + 'tweets/.json',
            method: 'GET'
        }).success(function (data) {
            userTweets.length = 0;
            for (var m in data) {
                var tweet = data[m];
                tweet.id = m;
                userTweets.push(tweet);
            }

            deferred.resolve(userTweets);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    var addTweet = function (tweetText) {
        var deferred = $q.defer();
        var tweet = {
            message: tweetText,
            timestamp: new Date(),
            user: user.name
        }
        $http({
            url: baseurl + 'tweets/.json',
            method: 'POST',
            data: tweet
        }).success(function (data) {            
            tweet.id = data.name;
            userTweets.push(tweet);

            deferred.resolve(userTweets);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    var deleteTweet = function (tweet) {
        var index = userTweets.indexOf(tweet);
        if (index == -1) {
            return;
        }

        var deferred = $q.defer();

        $http({
            url: baseurl + 'tweets/' + tweet.id + '.json',
            method: 'DELETE'
        }).success(function (data) {
            userTweets.splice(index, 1);

            deferred.resolve(userTweets);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    var updateUser = function (name, location, photo) {
        newUser = {
            name: name,
            location: location,
            photo: photo
        }
        var deferred = $q.defer();

        $http({
            url: baseurl + 'profile/' + user.id + '.json',
            method: 'PATCH',
            data: newUser
        }).success(function (data) {
            newUser.id = data.name;
            user = newUser;

            deferred.resolve(newUser);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    return {
        loadUser: loadUser,
        loadUserTweets: loadUserTweets,
        addTweet: addTweet,
        showFewerTweets: showFewerTweets,
        showAllTweets: showAllTweets,
        deleteTweet: deleteTweet,
        updateUser: updateUser
    }

})
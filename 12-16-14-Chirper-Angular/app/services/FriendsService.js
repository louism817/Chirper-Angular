app.factory('FriendsService', function ($http, $q) {
    var friends = [];
    var timelineTweets = [];
    var baseurl = 'https://chirperlouism.firebaseio.com/';

    var showFewerTweets = function () {
        if (timelineTweets.length > 5) {
            var lessTweets = timelineTweets.slice((timelineTweets.length - 5), timelineTweets.length);
            return lessTweets;
        }

    }

    var showAllTweets = function () {
        return timelineTweets;
    }

    var loadFriends = function () {
        friends.length = 0;
        loadFriendsUrls().then(function () {
            loadFriendsProfiles().then(function () {
                loadFriendsTweets().then(function () {
                }, function () {
                    console.log('problem loading tweets');
                });//load tweets
            }, function () {
                console.log('problem loading profiles');
            });//load profiles
        }, function () {
            console.log('problem loading urls');
        });//load urls
        
        return friends;
    }

    //var loadFriends = function () {
    //    friends.length = 0;
    //    loadFriendsUrls()
    //    loadFriendsProfiles()
    //    loadFriendsTweets()

    //    return friends;
    //}

    var loadFriendsProfiles1 = function () {
        for (var i = 0; i < friends.length; i++) {
            var friend = friends[i];
            loadFriendProfile(friend).then(function () {
                console.log('loaded profiles');
            }, function () {
                console.log('problem loading profiles');
            });
        }
    }


    var loadFriendsProfiles = function () {
        for (var i = 0; i < friends.length; i++) {
            var deferred = $q.defer();
            var friend = friends[i];
            $http({
                url: friend.url + 'profile/.json'
            }).success(function (data) {
                for (var m in data) {
                    friend.profile = data[m];
                }
                deferred.resolve();
            }).error(function () {
                deferred.reject();
            });
            return deferred.promise;
        }
        
    }

    var loadFriendsTweets1 = function () {
        for (var i = 0; i < friends.length; i++) {
            var friend = friends[i];
            loadFriendTweets(friend).then(function () {
                console.log('loaded profiles');
            }, function () {
                console.log('problem loading profiles');
            });
        }
    }
    var loadFriendsTweets = function () {
        timelineTweets.length = 0;
        for (var i = 0; i < friends.length; i++) {
            var friend = friends[i];
            var deferred = $q.defer();

            $http({
                url: friend.url + 'tweets/.json'
            }).success(function (data) {
                friend.tweets = [];
                for (var m in data) {
                    var tweet = data[m]
                    tweet.id = m;
                    friend.tweets.push(tweet);
                    timelineTweets.push(tweet);
                }
                deferred.resolve();
            }).error(function () {
                deferred.reject();
            });
            
        }
        return deferred.promise;
    }


    //var loadFriends = function () {
    //    var deferred = $q.defer();

    //    loadFriendsUrls().then(function (data) {
    //        //deferred.resolve()
    //        for (var i = 0; i < friends.length; i++) {
    //            var friend = friends[i];
    //            loadFriendProfile(friend).then(function (data) {
    //                loadFriendTweets(friend).then(function (data) {
    //                    deferred.resolve(friends);
    //                }, function () {
    //                    console.log('error getting friend messages');
    //                });
                        
    //            }, function() {
    //                console.log('error geting friend');
    //            });
    //        };//for
    //        }, function () {
    //            console.log('error getting profile');
    //        });
    //    return deferred.promise;
    //}

    //var loadFriendProfile = function (friend) {
    //    var deferred = $q.defer();

    //    $http({
    //        url: friend.url + 'profile/.json'
    //    }).success(function (data) {
    //        for (var m in data) {
    //            friend.profile = data[m];
    //        }
    //        deferred.resolve();
    //    }).error(function () {
    //        deferred.reject();
    //    });
    //    return deferred.promise;
    //}

    //var loadFriendTweets = function (friend) {
    //    var deferred = $q.defer();

    //    $http({
    //        url: friend.url + 'tweets/.json'
    //    }).success(function (data) {
    //        friend.tweets = [];
    //        for (var m in data) {
    //            var tweet = data[m]
    //            tweet.id = m;
    //            friend.tweets.push(tweet);
    //        }
    //        deferred.resolve();
    //    }).error(function () {
    //        deferred.reject();
    //    });
    //    return deferred.promise;
    //}

    // Load user profile urls from database
    var loadFriendsUrls = function () {
        var deferred = $q.defer();

        $http({
            url: baseurl + 'friends/.json',
            method: 'GET'
        }).success(function (data) {
            for (var m in data) {
                var friend = data[m]
                friend.id = m;
                friends.push(friend);
            }
            deferred.resolve(friends);
        }).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    }

    
    var loadTimelineTweets = function () {
        for (var i = 0; i < friends.length; i++) {
            var friend = friends[i];
            for (var ii = 0; ii < friend.tweets.length; ii++) {
                timelineTweets.push(friend.tweets[ii]);
            }
        }
        return timelineTweets;
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
           timelineTweets.push(tweet);

           deferred.resolve(timelineTweets);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    var deleteTweet = function (tweet) {
        var index =timelineTweets.indexOf(tweet);
        if (index == -1) {
            return;
        }

        var deferred = $q.defer();

        $http({
            url: baseurl + 'tweets/' + tweet.id + '.json',
            method: 'DELETE'
        }).success(function (data) {
           timelineTweets.splice(index, 1);

           deferred.resolve(timelineTweets);
        }).error(function () {
            deferred.reject();

        });

        return deferred.promise;
    }

    var updateFriend = function (name, location, photo) {
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
        loadFriends: loadFriends,
        loadTimelineTweets: loadTimelineTweets,
        addTweet: addTweet,
        showFewerTweets: showFewerTweets,
        showAllTweets: showAllTweets,
        deleteTweet: deleteTweet
    }

})
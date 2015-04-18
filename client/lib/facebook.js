fbApp = {
    Id : '1599903186934540',
    Secret : '68d33bcf9c68c9688c6d3ff61928ecab',
    Namespace : 'fb_xemcungnhau_com',
    CanvasPage : 'https://apps.facebook.com/fb_xemcungnhau_com',
    AppCenterUrl : '//www.facebook.com/appcenter/' + this.Namespace
};

/*ServiceConfiguration.configurations.upsert(
    { service: "facebook" },
    { $set: { appId: fbApp.Id, secret: fbApp.Secret } }
);*/

fbApi = function(endpoint,method,options){
    var method = method || 'get';
    var defer = Q.defer();
    var path = "/" + endpoint;
    FB.api(path,method,options,function(response){
        defer.resolve({
            endpoint : endpoint,
            result : response
        });
    })
    return defer.promise;
}

var GET = "get";
var PUT = "put";
var POST = "post";
var DELETE = "delete";

var fb_getLoginStatus = function(){
    var defer = Q.defer();
    FB.getLoginStatus(function(response){
        /*if (response.status === 'connected') {
            defer.resolve("CONNECTED");
        }
        else if (response.status === 'not_authorized') {
            defer.resolve("NOT_AUTHORIZED");
            //fb_Login();
        }
        else {defer.resolve("NOT_CONNECT")}*/
        defer.resolve(response.status.toUpperCase())
    });
    return defer.promise;
}
var fb_Login = function(){
    var defer = Q.defer();
    FB.login(function(response){
        defer.resolve(response);
    },{scope : 'email,user_friends,publish_actions'});
    return defer.promise;
}

//deferredFacebook = undefined;
fbMe = function(){
    FB.api('/me','get',{fields:'id,name,email,picture.width(120).height(120)'},function(res){
        Session.set('fbUser',res);
    })
}
facebookLoader = function(){


}

decorate = function(facebook) {
    var newFacebook = Object.create(facebook);
    newFacebook.api = function (path, method, params) {
        //TODO support batch requests
        console.log("path, method, params",path, method, params);
        var deferred = Q.defer();
        var args = [path];
        if(typeof method === "string") {
            args.push(method);
        }
        if(typeof params === "object") {
            args.push(params);
        }
        args.push(function(response) {
            console.log("response", response);
            if (response && response.error) {
                deferred.reject(new Error(response.error.message, response.error));
            } else {
                deferred.resolve(response);
            }
        });
        facebook.api.apply(facebook, args);
        return deferred.promise;
    };
    newFacebook.ui = function (params) {
        var deferred = Q.defer();
        facebook.ui(
            params,
            function(response) {
                if (response && response.error) {
                    deferred.reject(new Error(response.error));
                } else {
                    deferred.resolve(response);
                }
            });
        return deferred.promise;
    };
    newFacebook.login = function (params) {
        var deferred = Q.defer();
        facebook.login(
            function(response) {
                if (response.authResponse) {
                    deferred.resolve(newFacebook);
                } else {
                    deferred.reject(new Error("Login failed"));
                }
            }, params);
        return deferred.promise;
    };
    newFacebook.logout = function () {
        var deferred = Q.defer();
        facebook.logout(
            function(response) {
                if (response) {
                    deferred.resolve(newFacebook);
                } else {
                    deferred.reject(new Error("Logout failed"));
                }
            });
        return deferred.promise;
    };
    newFacebook.getLoginStatus = function (force) {
        var deferred = Q.defer();
        facebook.getLoginStatus(
            function(response) {
                if (response && response.error) {
                    deferred.reject(new Error(response.error));
                } else {
                    deferred.resolve(response);
                }
            }, force);
        return deferred.promise;
    };
    //explicit(newFacebook);
    return newFacebook;
}


var explicit = function(facebook) {
    //
    // users
    //
    facebook.allTestUsers = function allTestUsers() {
        return facebook.api(testUsersEdge(), GET)
            .get("data");
    };
    facebook.newTestUser = function newTestUser() {
        return facebook.api(testUsersEdge(), POST, { permissions: "read_stream" });
    };
    facebook.deleteAllTestUsers = function deleteAllTestUsers() {
        return facebook.allTestUsers()
            .then(function (users) {
                // remove Open Graph Test User
//                var appUsers = [];
//                users.forEach(function (user) {
//                    if (user.id !== "1394361990850452") {
//                        appUsers.push(user);
//                    }
//                });
                return Q.all(users.map(function (user) {
                    return facebook.deleteUser(user);
                }));
            });
    };
    //
    // user
    //
    facebook.user = function user(userId) {
        return facebook.api(idEdge(userId), GET);
    };
    facebook.deleteUser = function deleteUser(user) {
        return facebook.api(userEdge(user), DELETE);
    };
    facebook.updateUser = function updateUser(user, data) {
        return facebook.api(userEdge(user), POST, data);
    };
    facebook.picture = function (user, params) {
        return facebook.api(pictureEdge(user), GET, params).get("data");
    };
    facebook.makeFriendAndAccept = function (friend1, friend2) {
        return facebook.api(friendEdge(friend1, friend2), POST)
            .then(function () {
                return facebook.api(friendEdge(friend2, friend1), POST);
            });
    }
    //
    // album
    //
    facebook.albums = function (user) {
        return facebook.api(albumsEdge(user), GET).get("data");
    };
    facebook.albumNamed = function (user, name) {
        return facebook.albums(user)
            .then(function (albums) {
                return Q.all(albums.filter(function (album) {
                    return album.name === name;
                }))
                    .then(function (albums) {
                        if(albums && albums.length === 1 ) {
                            return albums[0];
                        } else {
                            throw new Error("No single album found named, "+name+".")
                        }
                    })
            });
    };
    facebook.albumPhotos = function (album) {
        if(typeof album === "undefined") {

        }
        return facebook.api(albumPhotosEdge(album), GET).get("data");
    };
    //
    // my
    //
    facebook.myFriends = function () {
        return facebook.api(myFriendsEdge(), GET).get("data");
    };

}
var idEdge = function (id) {
    return "/" + id;
}
var meEdge = function () {
    return "/me";
}
var testUsersEdge = function () {
    return "/" + APP_ID + "/accounts/test-users";
}
var userEdge = function (user) {
    return idEdge(user.id);
}
var pictureEdge = function (user) {
    return idEdge(user.id) + "/picture";
}
var friendEdge = function (friend1, friend2) {
    return "/" + friend1.id + "/friends/" + friend2.id;
}
var myFriendsEdge = function () {
    return meEdge() + "/friends";
}
var albumsEdge = function (user) {
    return idEdge(user.id) + "/albums";
}
var albumPhotosEdge = function (album) {
    return idEdge(album.id) + "/photos";
}

/*
facebookCache = {
    me: {},
    user: {},
    permissions: [],
    friends: [],
    invitable_friends: [],
    apprequests: [],
    reRequests: {}
};

getFacebookCacheData = function(endpoint, callback, options) {
    if(endpoint) {
        var url = '/';
        if(endpoint == 'me') {
            url += endpoint;
        } else if(endpoint == 'scores') {
            url += fbApp.Id + '/' + endpoint;
        } else {
            url += 'me/' + endpoint;
        }
        FB.api(url, options, function(response) {
            if( !response.error ) {
                facebookCache[endpoint] = response.data ? response.data : response;
                if(callback) callback();
            } else {
                console.error('getFacebookCacheData',endpoint, response)
            }
        });
    } else {
        getMe(function() {
            getPermissions(function() {
                getFriends(function() {
                    getInvitableFriends(callback);
                });
            });
        });
    }
}

getMe = function(callback) {
    getFacebookCacheData('me', callback, {fields: 'id,name,first_name,picture.width(120).height(120)'});
}

getPermissions = function(callback) {
    getFacebookCacheData('permissions', callback);
}

getFriends = function(callback) {
    getFacebookCacheData('friends', callback, {fields: 'id,name,first_name,picture.width(120).height(120)',limit: 8});
}

getInvitableFriends = function(callback) {
    getFacebookCacheData('invitable_friends', callback, {fields: 'name,first_name,picture',limit: 8});
}

getScores = function(callback) {
    getFacebookCacheData('scores', callback, {fields: 'score,user.fields(first_name,name,picture.width(120).height(120))'});
}

getOpponentInfo = function(id, callback) {
    FB.api(String(id), {fields: 'id,first_name,name,picture.width(120).height(120)' }, function(response){
        if( response.error ) {
            console.error('getOpponentInfo', response.error);
            return;
        }
        if(callback) callback(response);
    });
}

getRequestInfo = function(id, callback) {
    FB.api(String(id), {fields: 'from{id,name,picture}' }, function(response){
        if( response.error ) {
            console.error('getRequestSenderInfo', response.error);
            return;
        }
        if(callback) callback(response);
    });
}

deleteRequest = function(id, callback) {
    FB.api(String(id), 'delete', function(response){
        if( response.error ) {
            console.error('deleteRequest', response.error);
            return;
        }
        if(callback) callback(response);
    });
}

hasPermission = function(permission) {
    for( var i in facebookCache.permissions ) {
        if(
            facebookCache.permissions[i].permission == permission
            && facebookCache.permissions[i].status == 'granted' )
            return true;
    }
    return false;
}

loginCallback = function(response) {
    if(response.status != 'connected') {
        top.location.href = fbApp.AppCenterUrl;
    }
}

login = function(callback) {
    FB.login(callback, {scope: 'user_friends,publish_actions', return_scopes: true});
}

reRequest = function(scope, callback) {
    FB.login(callback, { scope: scope, auth_type:'rerequest'});
}

onStatusChange = function(response) {
    if( response.status != 'connected' ) {
        login(loginCallback);
    } else {
        Meteor.call('getFacebookData','me',function(err,data){

        })
        /!*getMe(function(){
            getPermissions(function(){
                if(hasPermission('user_friends')) {
                    getFriends(function(){

                        urlHandler(window.location.search);
                    });
                } else {
                    console.log(window.location.search)
                    urlHandler(window.location.search);
                }
            });
        });*!/
    }
}

onAuthResponseChange = function(response) {
    if( response.status == 'connected' ) {
        getPermissions();
    }
}

sendChallenge = function(to, message, callback, turn) {
    var options = {
        method: 'apprequests'
    };
    if(to) options.to = to;
    if(message) options.message = message;
    if(turn) options.action_type = 'turn';
    FB.ui(options, function(response) {
        if(callback) callback(response);
    });
}

sendBrag = function(caption, callback) {
    FB.ui({ method: 'feed',
        caption: caption,
        picture: 'http://www.friendsmash.com/images/logo_large.jpg',
        name: 'Checkout my Friend Smash greatness!'
    }, callback);
}

publishOGSmashAction = function(params, callback) {
    // Can we publish via the API?
    if( !hasPermission('publish_actions') ) {
        // Have we asked the player for publish_actions already this game?
        if( !facebookCache.reRequests['publish_actions'] ) {
            // Ask for the permission
            reRequest('publish_actions', function(response) {
                // Check permission was granted, recurse the method
                facebookCache.reRequests['publish_actions'] = true;
                getPermissions(function() {
                    publishOGSmashAction(params);
                });
            });
        } else {
            // They said no to publish_actions, use the dialog
            FB.ui({
                method: 'share_open_graph',
                action_type: 'friendsmashsample:smash',
                action_properties: {
                    profile: params.profile,
                    score: params.score,
                    coins: params.coins
                }
            }, function(response){
                console.log('share_open_graph', response);
                if(callback) callback(response);
            });
        }
    } else {
        // We can publish via the API
        FB.api('/me/friendsmashsample:smash', 'post', {
            profile: params.profile,
            score: params.score,
            coins: params.coins,
            message: params.message,
            'fb:explicitly_shared': true
        }, function(response) {
            console.log('Open graph action via API', response);
            if(callback) callback(response);
        });
    }
}

/!*sendScore = function (score, callback) {
    // Check current score, post new one only if it's higher
    FB.api('/me/scores', function(response) {
        if( response.data && response.data.score < score ) {
            FB.api('/me/scores', 'post', { score: score }, function(response) {
                if( response.error ) {
                    console.error('sendScore failed',response);
                } else {
                    console.log('Score posted to Facebook', response);
                }
                callback();
            });
        }
    });
}*!/

share = function(callback) {
    FB.ui({
        method: 'share',
        href: 'http://apps.facebook.com/' + appNamespace + '/share.html'
    }, function(response){
        console.log('share', response);
        if(callback) callback(response);
    });
}

logGamePlayedEvent = function(score) {
    var params = {
        'score': score
    };
    FB.AppEvents.logEvent('game_played', null, params);
}

getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

urlHandler = function(data) {
    // Called from either setUrlHandler or using window.location on load, so normalise the path
    var path = data.path || data;
    console.log('urlHandler', path);

    var request_ids = getParameterByName(path, 'request_ids');
    var latest_request_id = request_ids.split(',')[0];

    if (latest_request_id) {
        // Probably a challenge request. Play against sender
        getRequestInfo(latest_request_id, function(request) {
            playAgainstSomeone(request.from.id);
            deleteRequest(latest_request_id);
        });
    }
}*/

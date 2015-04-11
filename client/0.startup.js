App = {}
if(Meteor.isClient){
    Meteor.startup(function(){
        facebookLoader()
    });

}
Tracker.autorun(function(c){
    var fbUser = Session.get('fbUser');

    if(Session.get("is Facebook JDK loaded?") && _.isUndefined(fbUser)){
        FB.api('/me','get',{fields:'id,name,email,picture.width(120).height(120)'},function(res){

            Session.set('fbUser',res);
        })
    }else{
        if(fbUser && _.has(fbUser,'id')){
            var exists = Meteor.users.findOne({profile : {id : fbUser.id}});
            if(exists){
                Meteor.loginWithPassword(fbUser.email,fbUser.id,function(err){
                    alert(err)
                    if(!err){
                        c.stop();
                        FlowRouter.go('/');
                    }

                })
            }else{
                Meteor.call('createUserFacebook',fbUser,function(){
                    App.login(fbUser.email,fbUser.id,function(res){
                        c.stop();
                        FlowRouter.go('/');
                    })
                });
            }

        }
    }
})

App.login = function(email,password,cb){
    onLogin = function(err){
        return cb && cb(err)
    }
    Meteor.loginWithPassword(email, password, onLogin);
}
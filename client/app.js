App = {}

Tracker.autorun(function(c){
    if(!Meteor.userId()){
        var fbUser = Session.get('fbUser');
        if(fbUser){
            if(_.has(fbUser,'me')){
                fbUser = fbUser.me;
                var user = Meteor.users.findOne({profile : {id : fbUser.id}});
                if(user){
                    Meteor.loginWithPassword(user.profile.email,fbUser.profile.id,function(err){
                        alert(err)
                        if(!err){
                            c.stop();
                            FlowRouter.go('/');
                        }

                    })
                }else{
                    var fakeUser = Fake.user({
                        fields: ['email', 'fullname']
                    });
                    if(!_.has(fbUser,'email')) _.extend(fbUser,{email : fakeUser.email});
                    if(!_.has(fbUser,'name')) _.extend(fbUser, {name : fakeUser.fullname});
                    console.log('FBUSER:',fbUser)
                    Meteor.call('createUserFacebook',fbUser,function(){
                        App.login(fbUser.email,fbUser.id,function(res){
                            c.stop();
                            FlowRouter.go('/');
                        })
                    });
                }
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

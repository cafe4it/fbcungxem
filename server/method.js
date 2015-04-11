Meteor.methods({
    createUserFacebook : function(fbUser){
        if(fbUser){
            var exists = !!Meteor.users.findOne({ emails: { $elemMatch: { address: fbUser.email } } });
            //console.log('fbUser, exists',fbUser,exists)
            if(!exists){
                var userId = Accounts.createUser({
                    email : fbUser.email,
                    password : fbUser.id,
                    profile : fbUser
                });
                console.log(userId);
                Meteor.users.update({_id : userId},{
                    $set :{
                        'emails.0.verified': true
                    }
                });
                return true;
            }
        }
        return false;
    }
})
Template.signIn.rendered = function(){
    $(document).ready(function(){
        /*Meteor.setTimeout(function(){
            Meteor.loginWithFacebook({
                requestPermissions: ['publish_actions','email']
            },function(err,rs){
                if(err) console.log(err)
            })
        },2000)*/
    })
}

Template.signIn.events({
    'click #btnLogin' : function(e,t){
        FB.api('/me','get',{fields:'id,name,email,picture.width(120).height(120)'},function(res){
            Session.set('fbUser',res);
        })
    }
})
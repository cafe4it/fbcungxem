Template.my_channel.created = function(){
    Session.set('currentPath',FlowRouter.current().path)
}

Template.my_channel.helpers({
    fbMe : function(){
        var fbMe = Session.get('fbUser').me;
        console.log(Session.get('fbUser'))
        return fbMe;
    }
})

Template.my_channel.events({
    'click #btnPostMe' : function(e,t){
        e.preventDefault();
        var fbUser = Session.get('fbUser');
        if(fbUser){
            if(_.has(fbUser,'permissions') && !_.has(fbUser,'reRequest') && !hasPermission('publish_actions')){
                fbUser = _.extend(fbUser,{reRequest : []});
                fbUser.reRequest['publish_actions'] = true;
                Session.set('fbUser',fbUser);
                reRequest('publish_actions',function(){
                    getPermissions(function(){
                        console.log('info:','done request permission : publish_actions.')
                        FB_Api('/me/feed','POST',{'message' : 'Mời bạn xem phim cùng tôi'}).then(function(err,res){
                            alert(err,res)
                        })
                    })
                })
            }else if(_.has(fbUser,'permission') && hasPermission('publish_actions')){
                FB_Api('/me/feed','POST',{'message' : 'Mời bạn xem phim cùng tôi'}).then(function(err,res){
                    alert(err,res)
                })
            }
        }
    }
})
Template.header.helpers({
    fbUser : function(){
        var currentUser = Meteor.user();
        return currentUser;
    },
    isActivePath : function(path){
        return Session.get('currentPath') == path ? 'active' : ''
    }
})

Template.header.events({
    'click #btnLogout' : function(e,t){
        e.preventDefault();
        Meteor.logout(function(err,rs){

        })
    }
})
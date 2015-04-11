Template.header.helpers({
    fbUser : function(){
        var currentUser = Meteor.user();
        return currentUser;
    },
    isActivePath : function(path){
        return Session.get('currentPath') == path ? 'active' : ''
    }
})
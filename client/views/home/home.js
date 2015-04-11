Session.set('counter',0)
Template.home.created = function(){
    Session.set('currentPath',FlowRouter.current().path)
}

Template.home.helpers({
    counter : function(){
        return Session.get('counter');
    }
});

Template.home.events({
    'click #btnClickMe' : function(e,t){
        e.preventDefault();
        Session.set('counter',Session.get('counter')+1);
    }
})
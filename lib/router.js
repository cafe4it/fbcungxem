

FlowRouter.route('/',{
    middlewares: [requiredLogin],
    action : function(params, queryParams){
        FlowLayout.render('defaultLayout', {main: "home" });
    }
});

FlowRouter.route('/my-channel',{
    middlewares: [requiredLogin],
    action : function(params, queryParams){
        FlowLayout.render('defaultLayout', {main: "my_channel" });
    }
})

FlowRouter.route('/sign-in',{
    action : function(params,queryParams){
        FlowLayout.render('signIn');
    }
})

function requiredLogin(path, next) {
    // this works only because the use of Fast Render
    if(!Meteor.userId()) next('/sign-in')
    next();
}


FlowRouter.route('/',{
    middlewares: [requiredLogin],
    action : function(params, queryParams){
        FlowLayout.render('defaultLayout', {top : 'header',main: "home" });
    }
});

FlowRouter.route('/my-channel',{
    middlewares: [requiredLogin],
    action : function(params, queryParams){
        FlowLayout.render('defaultLayout', {top : 'header',main: "my_channel" });
    }
})

FlowRouter.route('/sign-in',{
    middlewares : [function(path,next){
        if(Meteor.userId()){
           next('/');
        }
        next()
    }],
    action : function(params,queryParams){
        FlowLayout.render('signIn');
    }
})

function requiredLogin(path, next) {
    // this works only because the use of Fast Render
    if(!Meteor.userId()){
        next('/sign-in')
    }
    next();
}
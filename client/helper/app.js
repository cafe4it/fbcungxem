Template.registerHelper("isPath",function(path){
    return FlowRouter.getParam() === path ? 'active' : ''
})
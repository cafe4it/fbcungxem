Meteor.startup(function() {
    SSLProxy({
        port: 6001, //or 443 (normal port/requires sudo)
        ssl : {
            key: Assets.getText("server.key"),
            cert: Assets.getText("server.crt")
        }
    });
});
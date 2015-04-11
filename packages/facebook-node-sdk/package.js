Package.describe({
  name: 'cafe4it:facebook-node-sdk',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});
Npm.depends({'fb' : '0.7.0'});
Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('facebook-node-sdk.js',['server']);
  if (typeof api.export !== 'undefined') {
    api.export(['FB'], ['server']);
  }
});
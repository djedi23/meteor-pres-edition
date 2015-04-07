Package.describe({
  name: 'djedi:pres-edition',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'https://github.com/djedi23/meteor-pres-edition',
  // URL to the Git repository containing the source code for this package.
  git: 'Live slides edition',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(['djedi:pres-collections',
    'djedi:pres-interactions',
    'alanning:roles'],
    ['client', 'server']);
  api.use(['templating', 'jquery',
    'numeral:numeral',
    'djedi:modules',
    'random',
    'reactive-var',
    'useraccounts:bootstrap'],
    ['client']);
  api.use(['mongo'],
    ['server']);

  
  api.addFiles(['client/edit.html','client/edit.js'],
    'client');
  api.addFiles(['methods/method.js'],
    ['client', 'server']);
  // api.addFiles(['server/method.js'],
  // 		 'server');
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('djedi:pres-edition');
//   api.addFiles('djedi:pres-edition-tests.js');
// });

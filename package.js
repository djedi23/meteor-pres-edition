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
  api.use(['djedi:pres-collections@0.0.1',
    'djedi:pres-interactions@0.0.1',
    'alanning:roles@1.2.13'],
    ['client', 'server']);
  api.use(['templating', 'jquery',
    'numeral:numeral@1.5.3',
    'djedi:modules@0.1.0',
    'random',
    'reactive-var',
    'useraccounts:bootstrap@1.8.1'],
    ['client']);
  api.use(['mongo'],
    ['server']);

  
  api.addFiles(['client/edit.html','client/edit.js'],
    'client');
  api.addFiles(['methods/method.js'],
    ['client', 'server']);
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('djedi:pres-edition');
//   api.addFiles('djedi:pres-edition-tests.js');
// });

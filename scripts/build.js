var buildify = require('buildify');
var scripts = [
    'helpers.js',    
    'var.js',
    'database.js',
    'checksession.js',
    'websockets.js',
    'logincallback.js',
    'createcallback.js',
    'html.js',    
    'main.js'
    
];

buildify().concat(scripts).save('./index.js').uglify().save('./index.min.js');
buildify().concat(['profile.js']).uglify().save('./profile.min.js');
buildify().load('../styles/style.css').cssmin().save('../styles/styles.min.css');

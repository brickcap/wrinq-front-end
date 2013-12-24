var buildify = require('buildify');
var scripts = [
    'database.js',
    'checksession.js',
    'websockets.js',
    'logincallback.js',
    'createcallback.js',
    'helpers.js',
    'html.js',    
    'main.js'
];

buildify().concat(scripts).save('./index.js').uglify().save('./index.min.js');
buildify().load('../styles/style.css').cssmin().save('../styles/styles.min.css');

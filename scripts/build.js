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
    'main.js',
    'reply.js',
    'sendMessage.js',
    'activity.js'
    
    
];

buildify().concat(scripts).save('./index.js').uglify().save('./index.min.js');
buildify().concat(['autolink.js','profile.js']).save('./profile.index.js').uglify().save('./profile.min.js');
buildify().load('../styles/style.css').cssmin().save('../styles/styles.min.css');

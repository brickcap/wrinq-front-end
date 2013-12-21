var buildify = require('buildify');
var scripts = [

    'helpers.js',
    'html.js',
    'logincallback.js',
    'createcallback.js',
    'main.js'
];

buildify().concat(scripts).save('./index.js').uglify().save('./index.min.js');
buildify().load('../styles/style.css').cssmin().save('../styles/styles.min.css');

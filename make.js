require('shelljs/make');

var path = require('path')
  , templates = require('templates')
  , requirejs = require('requirejs')
  , uglify = require('uglify-js2')
  , less = require('./node_modules/dpd-assets/node_modules/less')
  , LessParser = less.Parser;

var PUBLICDIR = './public-production';

target.all = function() {
  target.public();
};

target.public = function() {
  rm('-rf', PUBLICDIR);
  mkdir(PUBLICDIR);

  target.publicHtml();
  target.publicJs();
  target.publicCss();
  target.publicImg();
};

target.publicHtml = function() {
  cp('-f', path.join('./public/about.html'), path.join(PUBLICDIR));
  cp('-f', path.join('./public/browser-warning.html'), path.join(PUBLICDIR));
  target.publicIndexHtml();
};

target.publicIndexHtml = function() {
  templates.loadTemplates('./templates', function(err, index) {
    if (err) return console.error(err);
    index = index.replace('/less/style.less', '/css/style.css');
    index.to(path.join(PUBLICDIR, 'index.html'));
  });
};

target.publicJs = function() {
  /*jshint evil:true*/
  var jsdir = path.join(PUBLICDIR, 'js');
  var jslib = path.join(jsdir, 'lib');
  rm('-rf', jsdir);
  mkdir(jsdir);
  mkdir(jslib);
  cp('./public/js/lib/jquery-1.8.0.min.js', jslib);
  cp('./public/js/lib/require.js', jslib);
  cp('./public/js/lib/modernizr.js', jslib);

  var entry = cat('./public/js/entry.js');
  var match = entry.match(/require\.config\((\{(?:.|\s)*?\})\);/);
  if (match[1]) {
    var config = eval('(' + match[1] + ')');
    config.baseUrl = './public/js';
    config.name = 'entry';
    config.out = path.join(jsdir, 'entry.js');  
    requirejs.optimize(config, function(result) {
      var compressed = uglify.minify(config.out);
      compressed.code.to(config.out);
    });

  } else {
    console.error("Error finding require.config call in entry.js");
  }
};

target.publicCss = function() {
  var cssdir = path.join(PUBLICDIR, 'css');
  var oldCssdir = path.join('./public', 'css');
  rm('-rf', cssdir);
  mkdir(cssdir);
  mkdir(path.join(cssdir, 'south-street'));
  cp(path.join(oldCssdir, 'south-street', 'jquery-ui-1.8.23.custom.css'), path.join(cssdir, 'south-street'));

  target.publicCssLess();
};

target.publicCssLess = function() {
  var lessFile = cat('./less/style.less');
  cp('-r', './less/img', path.join(PUBLICDIR, 'css'));
  var parser = new LessParser({paths: ['./less']});
  parser.parse(lessFile, function(err, tree) { 
    if (err) return console.error(err);
    try {
      result = tree.toCSS();  
      result.to(path.join(PUBLICDIR, 'css', 'style.css'));
    } catch (ex) {
      console.error(ex);
    }
  });
};

target.publicImg = function() {
  cp('-r', './public/img', PUBLICDIR);
};
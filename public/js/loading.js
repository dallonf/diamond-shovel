define(function(require, exports, module) {

var loadingCount = 0;

exports.add = function() {
  loadingCount++;
  update();
};

exports.remove = function() {
  loadingCount--;
  update();
};

function update() {
  if (loadingCount > 0) {
    $('body').addClass('loading');
  } else {
    $('body').removeClass('loading');
  }
}

});
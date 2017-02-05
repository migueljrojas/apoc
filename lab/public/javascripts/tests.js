(function () {
    'use strict';

    console.log('blah'.repeat(3));

$(".shouldReact").each(function() {
    $(this).on('mouseenter', function() {
        $(this).addClass('reacted').html($(this).data('newcontent'));
    });
});

Console = function(){};

Console.prototype.log = function (val) {
    alert('Log: ' + val);
}

Console.prototype.error = function (val) {
    alert('Error: ' + val);
}

var Console = new Console();
//Console.log('Im a log');


/*function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}*/

var img = document.querySelector('#placeholder img');
var loadImg = new Image;
loadImg.src = img.getAttribute('data-src');

loadImg.onload = function(){
    img.src = this.src;
}


console.log(document.querySelectorAll("#menu p")[1].innerHTML);

})();

If (isEnable) {
    $('#btn').toggle();
}

var height = $('.element').height();

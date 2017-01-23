(function () {
    'use strict';

    // fade out
    function fadeOut(el){
      el.style.opacity = 1;

      (function fade() {

        if ((el.style.opacity -= .1) < 0) {
          setTimeout(function(){
            el.style.display = 'none';
            el.classList.add('is-hidden');
          }, 500);
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }

    // fade in
    function fadeIn(el, display){

      if (el.classList.contains('is-hidden')){
        el.classList.remove('is-hidden');
      }
      el.style.opacity = 0;
      el.style.display = display || "block";

      (function fade() {

        var val = parseFloat(el.style.opacity);
        
        if (!((val += .1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    }

    function createModal(el){

      var caModalCloseBtn = '<a class="ca-modal__close" data-modal="close"></a>';
      var caModal = document.createElement("div");

      caModal.setAttribute("class", "ca-modal");
      document.body.appendChild(caModal);
      caModal.insertAdjacentHTML('afterbegin', caModalCloseBtn);
      el = document.querySelector('.ca-modal');
      fadeIn(el);
    }

    function modalSwitch() {
      document.onclick = function(event) {

        var modalTriggerState = event.target.getAttribute('data-modal');
        var el = document.querySelector('.ca-modal');

        if ( modalTriggerState === 'open' ) {
          if (!el) {
            console.log('Modal instance doesnt exists');
            createModal(el);
          } else {
            fadeIn(el);
          }
        } else if (document.querySelectorAll("[data-modal]")[2].className === 'ca-modal__close' ) {
          fadeOut(el);
          console.log(el);
          console.log("Closing");
        }
      }
    }

    modalSwitch();
})();

(function () {
    'use strict';

    var modalTriggers = document.querySelectorAll('[data-modal]');

    /**
     * [fadeOut function to animate and hide a given element]
     * @param  {[String]} el [The matching element that will fade out]
     */
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

    /**
     * [fadeIn function to animate and show a given element]
     * @param  {[String]} el [The matching element that will fade in]
     */
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

    /**
     * [createModal Creates modal markup, attaches it to the DOM showing it with a fade in animation]
     */
    function createModal(){

      var caModalCloseBtn = '<a class="ca-modal__close" data-modal="close"></a>';
      var caModalContainer = '<div class="ca-modal__container"></div>';
      var caModal = document.createElement("div");
      var el;

      caModal.setAttribute("class", "ca-modal");
      document.body.appendChild(caModal);
      caModal.insertAdjacentHTML('afterbegin', caModalCloseBtn);
      caModal.insertAdjacentHTML('beforeend', caModalContainer);
      el = document.querySelector('.ca-modal');
      fadeIn(el);
    }

    /**
     * [modalSwitch Attaches a click event listener to the document and handles the modal show/hide ]
     */
    function modalSwitch() {
      document.onclick = function(event) {

        var modalTriggerState = event.target.getAttribute('data-modal');
        var el = document.querySelector('.ca-modal');

        if ( modalTriggerState === 'open' ) {
          if (!el) {
            createModal();
          } else {
            fadeIn(el);
          }
        } else if ( modalTriggerState === 'close' ) {
          fadeOut(el);
        }
      }
    }

    if( modalTriggers.length > 0 ) {
      modalSwitch();
    }

})();

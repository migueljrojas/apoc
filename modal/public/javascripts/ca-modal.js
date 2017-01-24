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
          }, 300);
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
    function createModal(source){

      var caModalCloseBtn = '<a class="ca-modal__close" data-modal="close"></a>';
      var caModalContainer = '<div class="ca-modal__container"></div>';
      var caModal = document.createElement("div");
      var caModalInstance;

      caModal.setAttribute("class", "ca-modal");
      document.body.appendChild(caModal);
      caModal.insertAdjacentHTML('afterbegin', caModalCloseBtn);
      caModal.insertAdjacentHTML('beforeend', caModalContainer);
      caModalInstance = document.querySelector('.ca-modal');

      detectContentType(source, contentHandler);

      fadeIn(caModalInstance);
    }

    function detectContentType(source, callback) {
      var dataSource = String(source);
      var data = {};

      if ( dataSource.endsWith('jpg') || dataSource.endsWith('png') ) {

        data.source = dataSource;
        data.type = 'image';

      } else if ( dataSource.test('youtube') || dataSource.test('vimeo') ) {

        data.source = dataSource;
        data.type = 'video';

      } else if ( dataSource.test('collection') ) {

        data.source = dataSource;
        data.type = 'gallery';

      } else {

        data.source = dataSource;
        data.type = 'document';

      }

      return data;

      if( typeof callback === 'function' && callback() ){
         callback(data);
      };
    }

    function contentHandler(content) {
      if ( content !== 'undefined' ){

        var contentType = content.type;

        switch (contentType){
          case 'image':
            console.log('Its an image');
            break;

          case 'video':
            console.log('Its a video');
            break;

          case 'gallery':
            console.log('Its a gallery');
            break;

          case 'document':
            console.log('Its a document');
            break;
        }

      }
    }

    /**
     * [modalSwitch Attaches a click event listener to the document and handles the modal show/hide ]
     */
    function modalSwitch() {
      console.log('Page has modals');

      document.onclick = function(event) {

        var trigger = event.target;

        if ( trigger.hasAttribute('data-modal') ) {
          console.log('You clicked a modal trigger');

          var modalTriggerState = trigger.getAttribute('data-modal');
          var modalTriggerSource = trigger.getAttribute('data-source');
          var modal = document.querySelector('.ca-modal');

          if ( modalTriggerState === 'open' ) {
            if (!modal) {
              createModal(modalTriggerSource);
            } else {
              fadeIn(modal);
              detectContentType(modalTriggerSource, contentHandler);
            }
          } else if ( modalTriggerState === 'close' ) {
            fadeOut(modal);
          }
        }
      }
    }

    if( modalTriggers.length > 0 ) {
      modalSwitch();
    }

})();

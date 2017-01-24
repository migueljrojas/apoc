(function () {
    'use strict';

    var modalTriggers = document.querySelectorAll('[data-modal]');
    var caModalContainer;

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
      caModalContainer = '<div class="ca-modal__container"></div>';
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

    function detectContentType(source, handler) {
      var dataSource = String(source);
      var data = {};

      if ( dataSource.endsWith('jpg') || dataSource.endsWith('png') ) {

        data.source = dataSource;
        data.type = 'image';

      } else if ( dataSource.toLowerCase().indexOf('youtube') >= 0 || dataSource.toLowerCase().indexOf('vimeo') >= 0 ) {

        data.source = dataSource;
        data.type = 'video';

      } else if ( dataSource.toLowerCase().indexOf('collection') >= 0 ) {

        data.source = dataSource;
        data.type = 'gallery';

      } else {

        data.source = dataSource;
        data.type = 'document';

      }

      if( typeof handler === 'function' && handler(data) ){
         handler(data);
      };

      return data;
    }

    function contentHandler(content) {
      if ( content !== 'undefined' ){

        var contentType = content.type;
        var contentSrc = content.source;

        switch (contentType){
          case 'image':
            htmlInjector('.ca-modal__container', imgConstructor(contentSrc));
            break;

          case 'video':

            var videoType,
                videoID;

            if ( contentSrc.toLowerCase().indexOf('youtube') >= 0 ) {
              videoType = 'youtube';

              var videoID = contentSrc.split('v=')[1];
              var amp = videoID.indexOf('&');
              if(amp != -1) {
                videoID = videoID.substring(0, amp);
              }

            } else if ( contentSrc.toLowerCase().indexOf('vimeo') >= 0 ) {
              videoType = 'vimeo';

              var videoID = contentSrc.split('.com/')[1];
              var amp = videoID.indexOf('&');
              if(amp != -1) {
                videoID = videoID.substring(0, amp);
              }
            }

            htmlInjector('.ca-modal__container', videoConstructor(videoType, videoID));
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

    function htmlInjector(target, html) {
      target = document.querySelector(target);
      target.appendChild(html);
    }

    function imgConstructor(src) {
      var img = document.createElement('img');
      img.setAttribute("src", src);

      return img;
    }

    function iframeConstructor(src) {
      var iframe = document.createElement('iframe');
      iframe.setAttribute("src", src);

      return iframe;
    }

    function videoConstructor(type, id) {
      var video = document.createElement('iframe');

      if ( type === 'youtube' ){
        video.setAttribute("src", 'https://www.youtube.com/embed/' + id);
      } else if ( type === 'vimeo' ) {
        video.setAttribute("src", 'https://player.vimeo.com/video/' + id);
      }

      return video;
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
            setTimeout(function(){
              document.querySelector('.ca-modal__container').innerHTML = '';
            }, 400);
            fadeOut(modal);
          }
        }
      }
    }

    if( modalTriggers.length > 0 ) {
      modalSwitch();
    }

})();

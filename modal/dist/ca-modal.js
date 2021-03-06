(function () {
    'use strict';

    //var newGallery = require("./gallery_script.js");
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

        caModalContainer = '<div class="ca-modal__container"><a class="ca-modal__close" data-modal="close"></a></div>';
        var caModal = document.createElement("div");
        var caModalInstance;

        caModal.setAttribute("class", "ca-modal");
        document.body.appendChild(caModal);
        caModal.insertAdjacentHTML('afterbegin', caModalContainer);
        caModalInstance = document.querySelector('.ca-modal');

        detectContentType(source, contentHandler);

        fadeIn(caModalInstance);
    }

    /**
     * [detectContentType Given a string url detects content type of the source
     * and creates an object with data source and data type. Optionally executes
     * a callback function with the data given or simply returns the object ]
     * @param  {[string]} source  [String url]
     * @param  {[function]} handler []
     * @return {[object]}         [description]
     */
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

            var limitX = dataSource.indexOf('(');
            var limitY = dataSource.indexOf(')');
            var parsedCollection = dataSource.slice(limitX + 1, limitY);

            data.source = parsedCollection;
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

    /**
     * [contentHandler receives a content object with type and source properties
     * and executes a set of functions depending on the type of the content received ]
     * @param  {[object]} content [Object with 'type' and 'source']
     */
    function contentHandler(content) {
        if ( content !== 'undefined' ){

            var contentType = content.type;
            var contentSrc = content.source;
            var containerClass = '.ca-modal__container';
            var container = document.querySelector(containerClass);

            switch (contentType){
                case 'image':
                if (container.classList.contains('--video')){
                    container.classList.remove('--video');
                }

                htmlInjector(containerClass, imgConstructor(contentSrc));
                break;

                case 'video':

                if (!container.classList.contains('--video')) {
                    container.className += ' --video';
                }

                var videoType,
                videoID;

                if ( contentSrc.toLowerCase().indexOf('youtube') >= 0 ) {
                    videoType = 'youtube';

                    var videoID = contentSrc.split('/embed/')[1];
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

                htmlInjector(containerClass, videoConstructor(videoType, videoID));
                break;

                case 'gallery':
                if (container.classList.contains('--video')){
                    container.classList.remove('--video');
                }

                htmlInjector(containerClass, galleryConstructor(contentSrc));
                break;

                case 'document':
                if (container.classList.contains('--video')){
                    container.classList.remove('--video');
                }

                htmlInjector(containerClass, iframeConstructor(contentSrc));
                break;
            }
        }
    }

    /**
     * [htmlInjector Utils function that receives a query selector string and an html node,
     * which injects into the DOM element that matches the query selector]
     * @param  {[string]} target [Query selector string where the HTML node will be injected]
     * @param  {[node]} html   [HTML node to be append as a child of the target matching element]
     */
    function htmlInjector(target, html) {
        target = document.querySelector(target);
        target.appendChild(html);
    }

    /**
     * [imgConstructor given a source string url, constructs and html image object]
     * @param  {[string]} src [Source url]
     * @return {[node]}     [HTML image to be returned after the function executes]
     */
    function imgConstructor(src) {
        var img = document.createElement('img');
        img.setAttribute("src", src);

        return img;
    }

    /**
     * [iframeConstructor given a source string url, constructs and html iframe object]
     * @param  {[type]} src [Source url]
     * @return {[type]}     [HTML iframe to be returned after the function executes]
     */
    function iframeConstructor(src) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute("src", src);

        return iframe;
    }

    /**
     * [videoConstructor given a source string url, checks wether is a youtube
     * or vimeo video and returns it into an embedable object]
     * @param  {[string]} type [Video type (Youtube or vimeo)]
     * @param  {[string]} id [ID from the video]
     * @return {[node]}     [Video embedable object]
     */
    function videoConstructor(type, id) {
        var video = document.createElement('iframe');

        if ( type === 'youtube' ){
            video.setAttribute("src", 'https://www.youtube.com/embed/' + id);
        } else if ( type === 'vimeo' ) {
            video.setAttribute("src", 'https://player.vimeo.com/video/' + id);
        }

        return video;
    }

    function galleryConstructor(src) {

        var obj = JSON.parse(src);

        console.log(obj);

        var gallery = document.createElement('div');


        return gallery;
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
                        var modalContainer = document.querySelector('.ca-modal__container');
                        while (modalContainer.childNodes.length > 1) {
                            modalContainer.removeChild(modalContainer.lastChild);
                        }
                    }, 300);
                    fadeOut(modal);
                }
            }
        }
    }

    if( modalTriggers.length > 0 ) {
        modalSwitch();
    }

})();

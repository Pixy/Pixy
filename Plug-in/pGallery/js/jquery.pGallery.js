/*
 * Plug-In jQuery
 * Développé par Pierre-Alexis GODET
 * 
 * Slidershow fullscreen
 * 
 * Utilise jScrollPane : 
 * jScrollPane - v2.0.0beta11 - 2011-07-04
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function($) {
  $.fn.pGallery = function(options) {
    var defauts = {
      'thumbnails': true, // Affichage ou non de la navigation par Thumbnails
      'navigation': true,  // Affichage ou non de la navigation par flèches
      'currentImg': 0,     // Première image appelée
      'fadeTime': 500,    // Durée de la transition lors de l'animation
      'circular': true,      // Circulaire
      'auto': false,        // Navigation automatique
      'intervalle': 5000,  // Intervalle pour la navigation automatique
      'title': ''                  // Titre principal du Slider
    }; 
    
    /*********************************
     * VARIABLES GLOBALES
     *********************************/
    var parametres = $.extend(defauts, options);
    var element = $(this); // On stock l'element
    var imagesContainer = $('#pListe li');
    var nbImages = imagesContainer.length;
    var currentImg = parametres.currentImg;
    var nextImg;
    var fadeTime = parametres.fadeTime;
    var animating = false;
    
    // Les tailles
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var pThumbnails;
    
    var init = false;
    
    
    function pGalleryInit() {
      if(init == false) {
        /*********************************
         * MISE EN PLACE DU MAIN CONTAINER 
         *********************************/
        $('body').append('<div id="pContainer"></div>');
        var pContainer = $('#pContainer');
        pContainer.css({
          'height': screenHeight,
          'width': screenWidth
        });
        
        /*********************************
         * TITRE DE LA PAGE
         *********************************/
        if(parametres.title != '') {
          pContainer.append('<div id="pTitle"><h2>' + parametres.title + '</h2></div>');
        } else {
          pContainer.append('<div id="pNoTitle"></div>');
        }
        
        /*********************************
         * CONTAINER FERMETURE
         *********************************/
        pContainer.append('<div id="pClose"><a href="#">X</a></div>');
        
        /*********************************
         * MISE EN PLACE DU CONTAINER IMAGE
         *********************************/
        $(pContainer).append('<div id="imageDisplayContainer"></div>');
        var imageDisplayContainer = $('#imageDisplayContainer');
        
        $(imageDisplayContainer).append('<div id="imageDisplay"></div>');
        var imageDisplay = $('#imageDisplay');
        
        
        
        
        
        /*********************************
         * NAVIGATION PAR THUMBNAILS
         *********************************/
        if(parametres.thumbnails == true) {
          pContainer.append('<div id="pThumbnails"><ul id="imagesThumb" ></ul></div>');
          pThumbnails = $('#pThumbnails');
          var imagesThumbs = $('#imagesThumb');
          imagesThumbs.css('width', (nbImages * 100) + (nbImages * 20));
          $(imagesContainer).each(function(i) {
            var thumbSrc = ($(imagesContainer[i]).find('a').attr('rel')) ?  $(imagesContainer[i]).find('a').attr('rel') :$(imagesContainer[i]).find('a').attr('href');
            imagesThumbs.append('<li id="thumb-' + i + '"><img src="' + thumbSrc + '" alt="' + $(imagesContainer[i]).find('a').html() + '" title="' + $(imagesContainer[i]).find('a').html() + '" /></li>');
          });
          $(pThumbnails).jScrollPane();
          $('#imagesThumb li').click(function(e) {
            e.preventDefault();
            displayImg($(this).attr('id').split('-')[1]);
          });
        }
        
        
        /*********************************
         * NAVIGATION PAR FLECHES
         *********************************/
        if(parametres.navigation == true) {
          pContainer.append('<div id="navLeft" class="nav prev left"><a href="#">L</a></div>');
          pContainer.append('<div id="navRight" class="nav next right"><a href="#">R</a></div>');
          
          // NEXT
          $('#navRight').click(function() {
            if(parseInt(currentImg) == nbImages - 1) { // Si c'est la dernière image
              if(parametres.circular == true) { // Si le slider est circulaire
                displayImg(0);
              }
            } else { // Sinon on incrémente
              displayImg(parseInt(currentImg) + 1);
            }
          });
          
          // PREV
          $('#navLeft').click(function() {
            if(parseInt(currentImg) == 0) { // Si c'est la première image
              if(parametres.circular == true) { // Si le slider est circulaire
                displayImg(nbImages - 1);
              }
            } else { // Sinon on décrémente
              displayImg(parseInt(currentImg) - 1);
            }
          });
        }
        
        
        /*********************************
         * RESIZE DE LA PAGE
         *********************************/
        $(window).resize(function() {
          // Mise à jour du layer de fond noir
          screenWidth = $(window).width();
          screenHeight = $(window).height();
          pContainer.css({
            'height': screenHeight,
            'width': screenWidth
          });
        });
        
        
        /*********************************
         * MISE A JOUR DE LA NAVIGATION
         *********************************/
        function updateNav() {
          $('#pContainer .disabled').removeClass('disabled');
          if(parseInt(currentImg) == nbImages - 1 && parametres.circular == false) { // Si c'est la première image et que le slider n'est pas circulaire
            $('#navRight').addClass('disabled');
          }
          if(parseInt(currentImg) == 0 && parametres.circular == false) { // Si c'est la première image et que le slider n'est pas circulaire
            $('#navLeft').addClass('disabled');
          }
        }
        
        /*********************************
         * MISE A JOUR DES THUMBS
         *********************************/
        function updateThumbs(numImage) {
          $('.thumbHover').removeClass('thumbHover');
          $('#thumb-' + numImage).addClass('thumbHover');
        }

        
        
        /*********************************
         * AFFICHAGE D'UNE NOUVELLE IMAGE
         *********************************/
        function displayImg(numNextImage) {
          if(animating == false) {
            nextImg = $($('#pListe li')[numNextImage]).find('a');

            var image = new Image();
            image.src = $(nextImg).attr('href');
            image.alt = $(nextImg).html();
            image.title = $(nextImg).html();
            
            $(image).one("load",function(){
              animating = true;
              imageDisplay.fadeOut(fadeTime, function() {
                $(this).empty().append(image).fadeIn(fadeTime, function() {
                currentImg = numNextImage;
                animating = false;
                if(parametres.navigation == true) { updateNav(); }
                if(parametres.thumbnails == true) { updateThumbs(currentImg); }
              });
              });
            })
            .each(function(){
              if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6))
              $(this).trigger("load");
            }); 
          }
        }
        
        /*********************************
         * FERMETURE
         *********************************/
        $('#pClose').click(function() {
          $('#pContainer').fadeOut(500);
        });
        

        
        /*********************************
         * AFFICHAGE PREMIERE IMAGE 
         *********************************/
        $('#pContainer').ready(function() {
          $(this).fadeIn(500, function() {
            displayImg(currentImg);
          });
        });
        
        init = true;
      }
    }
    
    
    /*********************************
     * AFFICHAGE PREMIERE IMAGE 
     *********************************/
    element.click(function() {
      pGalleryInit();
      $('#pContainer').fadeIn(500);
    });
      

  };
})(jQuery);
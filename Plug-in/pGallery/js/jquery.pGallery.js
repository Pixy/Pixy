/*
 * Développé par Pierre-Alexis GODET
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
      'thumbnails': true,
      'navigation': true,
      'currentImg': 0,
      'fadeTime': 500,
      'circular': true
    };  
    
    // Variables globales
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
    

    $('body').append('<div id="pContainer"></div>');
    var pContainer = $('#pContainer');
    pContainer.css({
      'height': screenHeight,
      'width': screenWidth
    });
    
    $(pContainer).append('<div id="imageDisplayContainer"></div>');
    var imageDisplayContainer = $('#imageDisplayContainer');
    
    $(imageDisplayContainer).append('<div id="imageDisplay"></div>');
    var imageDisplay = $('#imageDisplay');
    
    
    // Si navigation par thumbnails
    if(parametres.thumbnails == true) {
      pContainer.append('<div id="pThumbnails"><ul id="imagesThumb" ></ul></div>');
      pThumbnails = $('#pThumbnails');
      var imagesThumbs = $('#imagesThumb');
      imagesThumbs.css('width', (nbImages * 100) + (nbImages * 20));
      $(imagesContainer).each(function(i) {
        imagesThumbs.append('<li id="thumb-' + i + '"><img src="' + $(imagesContainer[i]).find('a').attr('href') + '" alt="' + $(imagesContainer[i]).find('a').html() + '" title="' + $(imagesContainer[i]).find('a').html() + '" /></li>');
      });
      $(pThumbnails).jScrollPane();
      $('#imagesThumb li').click(function(e) {
        e.preventDefault();
        displayImg($(this).attr('id').split('-')[1]);
      });
    }
    
    
    // Si navigation par thumbnails
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
        } else { // Sinon on incrémente
          displayImg(parseInt(currentImg) - 1);
        }
      });
    }
    
    
    // Au resize de la page
    $(window).resize(function() {
      screenWidth = $(window).width();
      screenHeight = $(window).height();
      pContainer.css({
        'height': screenHeight,
        'width': screenWidth
      });
    });
    
        
    // Fonction de navigation
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
            console.log(currentImg);
          });
          });
        })
        .each(function(){
          if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6))
          $(this).trigger("load");
        }); 
      }
    }

    
    // Mise à jour de la navigation 
    function updateNav() {
      $('#pContainer .disabled').removeClass('disabled');
      if(parseInt(currentImg) == nbImages - 1 && circular == false) { // Si c'est la première image et que le slider n'est pas circulaire
        $('#navRight').addClass('disabled');
      }
      if(parseInt(currentImg) == 0 && circular == false) { // Si c'est la première image et que le slider n'est pas circulaire
        $('#navLeft').addClass('disabled');
      }
    }
    
    
    /*********************************
    * AFFICHAGE PREMIERE IMAGE 
    *********************************/
    displayImg(currentImg);
    
    
  };
})(jQuery);
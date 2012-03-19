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
      'thumbnails': true,   // Affichage ou non de la navigation par Thumbnails - true
      'navigation': true,    // Affichage ou non de la navigation par flèches - true 
      'currentImg': 0,       // Première image appelée - 0
      'fadeTime': 500,      // Durée de la transition lors de l'animation - 500
      'circular': true,       // Circulaire - true
      'auto': false,          // Navigation automatique - false
      'interval': 5000,    // Intervalle pour la navigation automatique - 5000
      'title': '',                // Titre principal du Slider - ''
      'caption': false,     // Affichage des captions - false
      'loader': 'images/loader.gif', // Image de loader - 'images/loader.gif'
      'keyboardNav': true // Navigation par les flèches du clavier - true
    }; 
    
    
    /*********************************
     * NAVIGATEUR
     *********************************/
    var userAgent = navigator.userAgent.toLowerCase();
    var Browser = {
        Version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        Chrome: /chrome/.test(userAgent),
        Safari: /webkit/.test(userAgent),
        Opera: /opera/.test(userAgent),
        IE: /msie/.test(userAgent) && !/opera/.test(userAgent),
        Mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
        Check: function() { alert(userAgent); }
    };

    
    /*********************************
     * VARIABLES GLOBALES
     *********************************/
    var parametres = $.extend(defauts, options);
    var element = $(this); // On stock l'element
    var imagesContainer = $(this).find('.pListe li');
    var nbImages = imagesContainer.length;
    var currentImg = parametres.currentImg;
    var nextImg;
    var fadeTime = parametres.fadeTime;
    var animating = false;
    var functionInterval;
    
    /*********************************
     * ON CACHE LA LISTE DES IMAGES
     *********************************/
    $(element).find('.pListe').hide();
    
    
    /*********************************
     * INITIALISATION DE LA GALLERY
     *********************************/
    function pGalleryInit() {
      var pThumbnails;
      // Les tailles
      var screenWidth = $(window).width();
      var screenHeight = $(window).height();
      var divHeight = (parametres.thumbnails) ?  220 : 80
      
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

      // Fix de la hauteur au chargement
      updateHeight();
      
      
      
      /*********************************
       * NAVIGATION PAR THUMBNAILS
       *********************************/
      if(parametres.thumbnails == true) {
        pContainer.append('<div id="pThumbnails"><ul id="imagesThumb" ></ul></div>');
        pThumbnails = $('#pThumbnails');
        var imagesThumbs = $('#imagesThumb');
        imagesThumbs.css('width', (nbImages * 100) + (nbImages * 20));
        // On charge la liste des images dans la barre du bas
        $(imagesContainer).each(function(i) {
          var thumbSrc = ($(imagesContainer[i]).find('a').attr('rel')) ?  $(imagesContainer[i]).find('a').attr('rel') :$(imagesContainer[i]).find('a').attr('href');
          imagesThumbs.append('<li id="thumb-' + i + '"><img src="' + thumbSrc + '" alt="' + $(imagesContainer[i]).find('a').html() + '" title="' + $(imagesContainer[i]).find('a').html() + '" /></li>');
        });
        $(pThumbnails).jScrollPane(); // On initialise le ScrollPane
        // Evenement sur une thumb
        $('#imagesThumb li').click(function(e) {
          e.preventDefault();
          // On arrête l'interval
          if(parametres.auto == true) {
            clearInterval(functionInterval);
          }
          displayImg($(this).attr('id').split('-')[1]); // On affiche la prochaine image
        });
      }
      
      
      /*********************************
       * NAVIGATION PAR FLECHES
       *********************************/
      if(parametres.navigation == true) {
        pContainer.append('<div id="navLeft" class="nav prev left"><a href="#">&lt;</a></div>');
        pContainer.append('<div id="navRight" class="nav next right"><a href="#">&gt;</a></div>');
        
        // NEXT
        $('#navRight').click(function() {
          if(parseInt(currentImg) == nbImages - 1) { // Si c'est la dernière image
            if(parametres.circular == true) { // Si le slider est circulaire
              displayImg(0);
            }
          } else { // Sinon on incrémente
            displayImg(parseInt(currentImg) + 1);
          }
          // On arrête l'interval
          if(parametres.auto == true) {
            clearInterval(functionInterval);
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
          // On arrête l'interval
          if(parametres.auto == true) {
            clearInterval(functionInterval);
          }
        });
      }
      
      
      /*********************************
       * MISE A JOUR DE LA NAVIGATION PREV - NEXT
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
      function updateThumbs() {
        $('.thumbHover').removeClass('thumbHover');
        $('#thumb-' + currentImg).addClass('thumbHover');
      }

      /*********************************
       * AFFICHAGE D'UNE NOUVELLE IMAGE
       *********************************/
      function displayImg(numNextImage) {
        if(animating == false) {
          nextImg = $($(imagesContainer)[numNextImage]).find('a');

          var image = new Image();
          image.src = $(nextImg).attr('href');
          image.alt = $(nextImg).html();
          image.title = $(nextImg).html();
          
          $(imageDisplay).empty().append('<img src="' + parametres.loader + '" alt="loading" title="loading" />');
          
          $(image).one("load",function(){
            animating = true;
            $(imageDisplay).empty().append(image);
            updateImagePosition();
            $(imageDisplay).fadeIn(fadeTime, function() {
              currentImg = numNextImage;
              animating = false;
              if(parametres.navigation == true) { updateNav(); }
              if(parametres.thumbnails == true) { updateThumbs(); }
              if(parametres.caption == true) { initCaption(); }
            });
          })
          .each(function(){
            if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6))
            $(this).trigger("load");
          }); 
        }
      }
      
      
      /*********************************
       * RESIZE DE LA PAGE
       *********************************/
      // FONCTION DE RESIZE
      function updateHeight() {
        $('#imageDisplayContainer, #imageDisplay').height(screenHeight - divHeight);
      }
      
      // FONCTION DE MISE A JOUR DE LA POSITION EN HAUTEUR
      function updateImagePosition() {
        var currentImage = new Image();
        currentImage.src = $('#imageDisplay img').attr('src');
        var imageHeight = currentImage.height;
        if(imageHeight < $('#imageDisplay').height()) {
          if(Browser.Chrome) { // Si CHROME
            if(parametres.caption == true) {
              $('#imageDisplay img').css({
                  'top': screenHeight / 2,
                  'margin-top': (0 - imageHeight / 2 - 40)
                });
            } else {
              $('#imageDisplay img').css({
                'top': '50%',
                'margin-top':  (0 -  imageHeight / 2)
              });
            }
          } else { // Tous les autres navigateurs
            $('#imageDisplay img').css({
              'top': '50%',
              'margin-top':  (0 -  imageHeight / 2)
            });
          }
        } else { // Si la hauteur de l'image > container
          if(Browser.Chrome) { // Si CHROME
            $('#imageDisplay img').css({
                'top': '0',
                'margin-top': '0'
            });
          } else if (Browser.IE) { // Si IE
            $('#imageDisplay img').css({
                'top': '0',
                'margin-top': '0'
            });
          }
        } 
      }
      
      
      /** EVENEMENT RESIZE DOCUMENT **/
      $(window).resize(function() {
        // Mise à jour du layer de fond noir
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        pContainer.css({
          'height': screenHeight,
          'width': screenWidth
        });
        
        // Mise à jour de la Hauteur 
        updateHeight();
        
        // Mise à jour de la position en hauteur si image trop petite
        updateImagePosition();
        
        // Mise à jour du caption
        updateCaption();
        
        
        // Les thumbnails 
        if(parametres.thumbnails == true) {
          $(pThumbnails).jScrollPane();
        }
      });
      
      
      /*********************************
       * MISE EN PLACE DES CAPTIONS
       *********************************/
       /** INITIALISATION **/
      function initCaption() {
        //if(!Browser.Chrome) {
          if($('#imageDisplay img').attr('title') != '') {
            $('#imageDisplay').append('<div class="pCaption"><p>' + $('#imageDisplay img').attr('title') + '</p></div>');
            $('#imageDisplay .pCaption').delay(100).show(200, function() {
              updateCaption();
            });
          }
        //}
      }
      
      /** MISE A JOUR **/
      function updateCaption() {
        if(parametres.caption == true && $('#imageDisplay img').attr('title') != '') { 
          // Si IE < 9
          var marginTop = 60
          marginTop = (Browser.IE && Browser.Version < 9) ? 40 : marginTop
          
          var currentImage = new Image();
          currentImage.src = $('#imageDisplay img').attr('src');
          $('#imageDisplay .pCaption').width($('#imageDisplay img').width()+1);
          
          // Si la hauteur de l'image est inferieure à la taille du container
          if(currentImage.height < $('#imageDisplay').height()) {
            if(Browser.Chrome) {
              $('#imageDisplay .pCaption').css({
                'top': screenHeight / 2
              });
            } else {
              $('#imageDisplay .pCaption').css({
                'top': '50%',
                'margin-top':  (0 - marginTop)
              });
            }
          } else { // Si la hauteur de l'image est superieure
            if(Browser.Chrome) { // Si CHROME
             $('#imageDisplay .pCaption').css({
                'top': '0',
                'margin-top':  (0 - marginTop)
              });
            } else if (Browser.IE) {
              $('#imageDisplay .pCaption').css({
                'top': '0',
                'margin-top':  (0 - marginTop)
              });
            }
          }
        }
      }
      
      /*********************************
       * FONCTION DE FERMETURE
       *********************************/
      function closeGallery() {
        $('#pContainer').fadeOut(100, function() {
          clearInterval(functionInterval); // On supprime l'interval !
          currentImg = 0;
          nextImg = 0;
          animating = false;
          $(this).remove();
        });
      }
      
      /*********************************
       * EVENEMENTS FERMETURE
       *********************************/
      // Fermeture sur la croix
      $('#pClose').click(function() { // Sur la croix
        closeGallery();
      });
      
      
      
      /*********************************
       * AFFICHAGE PREMIERE IMAGE 
       *********************************/
      $('#pContainer').ready(function() {
        $(this).fadeIn(500, function() {
          displayImg(currentImg);
        });
      });
      
      /*********************************
       * NAVIGATION AUTOMATIQUE
       *********************************/
      // Start playing the animation
      if(parametres.auto == true) {
        functionInterval = setInterval(function() {
          currentImg = (currentImg == nbImages - 1) ? 0 : currentImg + 1 // Si on arrive au bout, on remet à 0, sinon on incrémente
          displayImg(currentImg);
        }, parametres.interval);
      }
      
      
      /*********************************
       * NAVIGATION PAR LE CLAVIER
       *********************************/
       $(document).keydown(function(e) {
         /** FERMETURE DE LA GALLERIE **/
        if (e.keyCode == 27) {
          closeGallery();
        }
        
        /** NAVIGATION PAR LES FLECHES DU CLAVIER **/
        if(parametres.keyboardNav == true) {
          // Flèche de droite - NEXT
          if (e.keyCode == 39) {
            if(parseInt(currentImg) == nbImages - 1) { // Si c'est la dernière image
              if(parametres.circular == true) { // Si le slider est circulaire
                displayImg(0);
              }
            } else { // Sinon on incrémente
              displayImg(parseInt(currentImg) + 1);
            }
            // On arrête l'interval
            if(parametres.auto == true) {
              clearInterval(functionInterval);
            }
          }
          
          // Flèche de gauche - PREV
           if (e.keyCode == 37) {
            if(parseInt(currentImg) == 0) { // Si c'est la première image
              if(parametres.circular == true) { // Si le slider est circulaire
                displayImg(nbImages - 1);
              }
            } else { // Sinon on décrémente
              displayImg(parseInt(currentImg) - 1);
            }
            // On arrête l'interval
            if(parametres.auto == true) {
              clearInterval(functionInterval);
            }
          }
        }
      });
      
      
      /*********************************
       * NAVIGATION PAR TOUCH MOBILE
       *********************************/
      
       
      
    } /****** FIN INITIALISATION ******/
    
    
    /*********************************
     * AFFICHAGE PREMIERE IMAGE 
     *********************************/
    element.click(function() {
      pGalleryInit();
      $('#pContainer').fadeIn(500);
    });
      

  };
})(jQuery);
/*
 * Développé par Pierre-Alexis GODET
 * 
 *
 *
 */
(function($) {
  $.fn.pGallery=function(options) {
    var defauts = {
      'callback': null, // Fonction de callback
      'imageLoader' : 'images/loader.gif' // Loader par défaut
    };  
    
    // Variables globales
    var parametres=$.extend(defauts, options);
    var element = $(this); // On stock l'element
    
    
    
  };
})(jQuery);
/*
 * Développé par Pierre-Alexis GODET
 * 
 * @PARAMS 
 * callback: Fonction à appeler après l'ajax
 * imageLoader: Chemin vers un loader
 * data: Les données à envoyer dans l'ajax
 * initialTab: Le numéro de l'onglet à charger en premier
 *
 *
 */
(function($) {
  $.fn.pTabs=function(options) {
    var defauts = {
      'callback': null, // Fonction de callback
      'imageLoader' : 'images/loader.gif', // Loader par défaut
      'data' : '', // Paramètres à passer dans l'ajax
      'initialTab' : 0 // L'onglet à charger par défaut
    };  
    
    // Variables globales
    var parametres=$.extend(defauts, options);
    var element = $(this); // On stock l'element
    element.find('ul').append( '<div class="pClear"></div>' ); // On ajoute une div après la liste
    element.append( '<div id="pTabsContainer"></div>' ); // On ajoute une div après la liste
    var content = $( '#pTabsContainer' ); // On le stock
    var tabLinks = $(this).find('li a');
    
    var firstTab = $(element.find('li')[parametres.initialTab]).find('a'); // On récupère le premier onglet à charger

    /*
     * Evenement sur le clic d'un tab
     */
    tabLinks.click(function(e) {
      e.preventDefault(); // On empêche le lien de s'ouvrir
      chargerPage($(this));
    });
    
    
    
    /*
     * Fonction de chargement d'une page
     */
    function chargerPage(currentTab) {
      // Loader de chargement 
      content.fadeOut(200, function() {
        $(this).empty().append('<div id="pTabsLoader"><img src="'+ parametres.imageLoader +'" alt="Loader" title="Loader" /></div>').fadeIn(100, function() {
          // Récupération de l'URL
          var url = $( currentTab ).attr( 'href' ); // Récupérationd de l'URL
          
          // Récupération des data
          if(parametres.data != '') {
            data = parametres.data( $( currentTab ) );
          } else {
            data = '';
          }
          
          $.ajax({
            url: url,
            data: data,
            success: function(response, status, request) {
              // Si erreur
              if(request.status != 200) {
                console.log(request.statusText);
                if(response == '') {
                  content.fadeOut(100, function() {
                    $(this).empty().append('Une erreur est survenue, veuillez nous excuser pour la gêne occasionnée').fadeIn(500);
                  });
                }
              } else {
                content.fadeOut(100, function() {
                  $(this).empty().append(response).fadeIn(500);
                });
              }
              
              // On enlève les classes currentTab
              $( '.currentTab' ).removeClass( 'currentTab' );
              // Puis on ajoute la classe à l'élément courant
              $(currentTab).parent().addClass( 'currentTab' );
              
              // Si callback
              if(parametres.callback) {
                parametres.callback($(this));
              }
            }
          });
        });
      });
      
    }
    
    
    /*
     * initialTab de l'onglet
     */
    chargerPage(firstTab);
    
  };
})(jQuery);
/************************************************************
  Listes des fonctions JavaScript
************************************************************/

/************************************************************
  Verifie le format d'une adresse mail
  Parametre : -chaine contenant le mail
************************************************************/
function checkMail(s) {
  regex = new RegExp("^[a-z0-9_]([.-]?[a-z0-9_]+)+@[a-z0-9_]([.-]?[a-z0-9_]+)+\.([a-z]{2,4}|[a-z]{6})$", "gi");
  return regex.exec(s);
}


/************************************************************
  Verification qu'une variable est numérique
  Renvoie false si le champ n'est pas numérique
  Renvoie vrai si le champ est numérique
************************************************************/
function isNumerique(variable)
{
  if(isNaN(variable)) {
    return false;
  } else {
    return true;
  }
}

/************************************************************
  Supprime les espaces en début et en fin de chaine
************************************************************/
function trim(myString)
{
  return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
}


/************************************************************
  Refuse la touche entrée pour les formulaires
************************************************************/
function refuserToucheEntree(event)
{
    // Compatibilité IE / Firefox
    if(!event && window.event) {
        event = window.event;
    }
    // IE
    if(event.keyCode == 13) {
        event.returnValue = false;
        event.cancelBubble = true;
    }
    // DOM
    if(event.which == 13) {
        event.preventDefault();
        event.stopPropagation();
    }
}




/************************************************************
  Trouve la position d'un objet passé en paramètres
************************************************************/
function findPos(obj) {
  var curleft = obj.offsetLeft || 0;
  var curtop = obj.offsetTop || 0;
  while (obj = obj.offsetParent) {
          curleft += obj.offsetLeft
          curtop += obj.offsetTop
  }
  return {x:curleft,y:curtop};
}

/************************************************************
  Rend la fonction précédente compatible avec jQuery
************************************************************/
jQuery.fn.extend({
   findPos : function() {
       obj = jQuery(this).get(0);
       var curleft = obj.offsetLeft || 0;
       var curtop = obj.offsetTop || 0;
       while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft
                curtop += obj.offsetTop
       }
       return {x:curleft,y:curtop};
   }
});
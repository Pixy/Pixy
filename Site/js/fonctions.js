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
  Verification qu'une variable est num�rique
  Renvoie false si le champ n'est pas num�rique
  Renvoie vrai si le champ est num�rique
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
  Supprime les espaces en d�but et en fin de chaine
************************************************************/
function trim(myString)
{
  return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
}


/************************************************************
  Refuse la touche entr�e pour les formulaires
************************************************************/
function refuserToucheEntree(event)
{
    // Compatibilit� IE / Firefox
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
/*****************************************************************************************************************/
/**                                 VALIDATION DES FORMULAIRES                                                  **/
/*****************************************************************************************************************/

/**
  VERIFIE LES CHAMPS OBLIGATOIRES
**/
function valider_champs_obligatoire(champs) {
  var valide = true;
  $(champs).each(function(i) {
    if($(this).val() == "") {
      updateTips($(this));
      valide = false;
    }
  });
  return valide;
}


function valider_champs_numerique(champs) {
  var valide = true;
  $(champs).each(function(i) {
    if(!isNumerique($(this).val())) {
      updateTips($(this));
      valide = false;
    }
  });
  return valide;
}


/** FOCUS LE CHAMP SI ERREUR **/
function updateTips( t ) {
  t.removeClass('good-tip');
  t.addClass( "bad-tip" );
  $('#error-'+t.attr('id')).fadeIn(500);
}


/** REINITIALISATION DES CHAMPS **/
function resetTips( t ) {
  $(t).each(function(i) {
    $('#error-'+$(this).attr('id')).fadeOut(500);
    $(this).removeClass('bad-tip');
    $(this).addClass('good-tip');
  });
}


/***************************************************************************************************************/
/**                                 AJOUT - MODIFICATION - SUPPRESSION                                        **/
/**                                           COLLECTION                                                      **/
/***************************************************************************************************************/


/**
EXEMPLE AJOUT
**/
function EXEMPLE_AJOUT() {
  var exemple = $('#exemple');
  
  var tips = [exemple];
  resetTips(tips);
  
  if(valider_champs_obligatoire(tips)) {
    $('#submitor').submit();
  } else {
    return false;
  }
}

/**
EXEMPLE SUPPRESSION
**/
function EXEMPLE_SUPPRIMER(id_exemple) {
  if(confirm('Voulez-vous supprimer ?')) {
    window.location.href="traitements/traitement-exemple.php?id_exemple="+id_exemple;
  } else {
    return false;
  }
}

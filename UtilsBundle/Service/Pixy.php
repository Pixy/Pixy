<?php

namespace Pixy\UtilsBundle\Service;

class Pixy {
  
  public function __construct() {}
  
  /**
   * Traitement d'une chaine à inserer dans une BDD
   * @return string
   */
  public function clean_text($chaine) {
    $chaine = htmlentities($chaine, ENT_NOQUOTES, 'utf-8');  
    return $chaine;
  }


  /**
   * Retourne une chaine coupée
   * Param : la chaine
   * Param : nombre max de caractères
   * @return string
   */
  public function tronquer_chaine($chaine, $nbCharMax) {
    if (strlen($chaine) > $nbCharMax) {
      $chaine = substr($chaine, 0, $nbCharMax);
      $last_space = strrpos($chaine, " ");
      $chaine = substr($chaine, 0, $last_space)."...";
    }
    return $chaine;
  }
  
  
  /**
   * En test : url-rewriting
   * Param : la chaine
   * @param string Chaine
   * @param array Replace
   * @param string Delimiter
   * @return string
   */
  function slug($str, $replace=array(), $delimiter='-')  {
		setlocale(LC_ALL, 'en_US.UTF8');
		if( !empty($replace) ) {
      $str = str_replace((array)$replace, ' ', $str);
		}
		$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
		return $clean;
}


  /**
   * UTILISER PLUTOT urlChars
   * Réécrit une chaine pour l'url-rewriting
   * @return string
   */
  public function url_rewrite_chaine($s) {
    // $s = strtr($s,
          // 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
          // 'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
    $s = $this->wd_remove_accents($s); // SUPPRIME LES ACCENTS AVEC UTF-8
    $s = preg_replace('/([^.a-z0-9]+)/i', '-', $s);
    $s = strtolower($s);
    return $s;
  }

  /**
   * Réécrit une chaine pour l'url-rewriting
   * @return string
   */
  public function urlChars( $url, $type = 'null' ) {
    $url = utf8_encode($url);
    $url = preg_replace("`\[.*\]`U","",$url);
    $url = preg_replace('`&(amp;)?#?[a-z0-9]+;`i','-',$url);
    $url = htmlentities($url, ENT_NOQUOTES, 'utf-8');
    $url = preg_replace( "`&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig);`i","\\1", $url );
    $url = preg_replace( array("`[^a-z0-9]`i","`[-]+`") , "-", $url);
    $url = ( $url == "" ) ? $type : strtolower(trim($url, '-'));
    
    return $url;
  }



  /**
   * Retourne une chaine clean pour un nom de fichier, tronqué si trop long
   * @return string
   */
  public function cleanImageName($chaine, $type = 'null') {
    $chaine = utf8_encode($chaine);
    $chaine = preg_replace("`\[.*\]`U","",$chaine);
    $chaine = preg_replace('`&(amp;)?#?[a-z0-9]+;`i','-',$chaine);
    $chaine = htmlentities($chaine, ENT_NOQUOTES, 'utf-8');
    $chaine = preg_replace( "`&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig);`i","\\1", $chaine );
    //$chaine = preg_replace( array("`[^a-z0-9]`i","`[-]+`") , "-", $chaine);
    $chaine = ( $chaine == "" ) ? $type : strtolower(trim($chaine, '-'));
    return $chaine;
  }


  /**
   * Supprime les accents
   * @return string
   */
  public function wd_remove_accents($str, $charset='utf-8')
  {
    $str = htmlentities($str, ENT_NOQUOTES, $charset);
    
    $str = preg_replace('#&([A-za-z])(?:acute|cedil|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
    $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str); // pour les ligatures e.g. '&oelig;'
    $str = preg_replace('#&[^;]+;#', '', $str); // supprime les autres caractères
    
    return $str;
  }


  /**
   * Retourne le nom de la page
   * @return string
   */
  public function getNomPage() {
    $nompage =  $_SERVER['PHP_SELF'];
    $nompage = explode('/',$nompage);
    $nompage = $nompage[COUNT($nompage)-1];
    return $nompage;
  }
  
  /**
   * @param type $string
   * @return type $string
   */
  public function getExtensionFile($file) {
    $file = explode('.',$file);
    $file = $file[COUNT($file)-1];
    return $file;
  }
 
  /**
   * Retourne le nom d'un fichier
   * @param string
   * @return string
   */
  public function getNomFile($file) {
    $file = explode('.',$file);
    $file = $file[COUNT($file)-2];
    return $file;
  }
  
  
  /**
   * Crée un dossier si il n'existe pas
   * @param type $dossier
   * @return type bool
   */
  public function creerDossier($dossier) {
    if(!is_dir($dossier)) {
        mkdir($dossier, 0755, true);
        return true;
    } else {
        return false;
    }
  }
  
  /**
   * Crée un lien cliquable à partir d'une URL
   * @param string $texte
   * @return string 
   */
  public function createLink($texte) {
    $in = array( '`((?:https?|ftp)://\\S+)(\\s|\\z)`',  '`([[:alnum:]]([-_.]?[[:alnum:]])*@[[:alnum:]]([-_.]?[[:alnum:]])*\.([a-z]))`');
    $out = array('<a href="$1" target="_blank">$1</a>$2','<a href="mailto:$1">$1</a>');
    $texte = preg_replace($in, $out, $texte); 
    return $texte;
  }
  
}
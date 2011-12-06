<?php

namespace Pixy;

abstract class Pixy {
  
  public function __construct() {}
  
  /**
   * Traitement d'une chaine à inserer dans une BDD
   * @return string
   */
  public static function clean_text($chaine) {
    $chaine = htmlentities($chaine, ENT_NOQUOTES, 'utf-8');  
    return $chaine;
  }


  /**
   * Retourne une chaine coupée
   * Param : la chaine
   * Param : nombre max de caractères
   * @return string
   */
  public static function tronquer_chaine($chaine, $nbCharMax) {
    if (strlen($chaine) > $nbCharMax) {
      $chaine = substr($chaine, 0, $nbCharMax);
      $last_space = strrpos($chaine, " ");
      $chaine = substr($chaine, 0, $last_space)."...";
    }
    return $chaine;
  }


  /**
   * Réécrit une chaine pour l'url-rewriting
   * @return string
   */
  public static function url_rewrite_chaine($s) {
    // $s = strtr($s,
          // 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
          // 'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
    $s = wd_remove_accents($s); // SUPPRIME LES ACCENTS AVEC UTF-8
    $s = preg_replace('/([^.a-z0-9]+)/i', '-', $s);
    $s = strtolower($s);
    return $s;
  }

  /**
   * Réécrit une chaine pour l'url-rewriting
   * @return string
   */
  public static function urlChars( $url, $type = 'null' ) {
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
  public static function cleanImageName($chaine, $type = 'null') {
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
  public static function wd_remove_accents($str, $charset='utf-8')
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
  public static function getNomPage() {
    $nompage =  $_SERVER['PHP_SELF'];
    $nompage = explode('/',$nompage);
    $nompage = $nompage[COUNT($nompage)-1];
    return $nompage;
  }
  
  /**
   *
   * @param type $string
   * @return type $string
   */
  public static function getExtensionFile($file) {
    $file = explode('.',$file);
    $file = $file[COUNT($file)-1];
    return $file;
  }
  
}
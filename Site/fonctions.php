<?php
require_once('config.php');
require_once('sql/liste_des_requetes.php');
/*****************************************************************/
/*                 Liste des fonctions PHP                       */
/*****************************************************************/


/**
 * Connexion à la base de données
 * @return pdo
 */
function connexionBDD() {
  try
  {
    $pdo = new PDO('mysql:host='.SQL_HOST.';dbname='.SQL_NAME, SQL_USERNAME, SQL_PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
  catch(Exception $e)
  {
    echo 'Erreur : '.$e->getMessage().'<br />';
    echo 'N° : '.$e->getCode();
  }
  
  if($pdo) {
    return $pdo;
  }
  else {
    return false;
  }
}

/**
 * Redirection vers la page de connexion si user non loggué
 */
function redirectLogOut() {
  if(!isset($_SESSION['CONNEXION']) || $_SESSION['CONNEXION'] == false) {
    deconnexion();
  }
}

/**
 * Deconnexion
 */
function deconnexion() {
  session_destroy();
  echo '<script type="text/javascript">
          alert("Vous devez être connecté pour pouvoir acceder à cette partie du site. Merci de vous loguer");
          window.location.href="index.php";
        </script>';
}

/**
 * Traitement d'une chaine à inserer dans une BDD
 * @return string
 */
function clean_text($chaine) {
  $chaine = htmlentities($chaine);
  //$chaine = str_replace("'","\'",$chaine); // A COMMENTER EN PROD !!
  $chaine = str_replace("’","\'",$chaine);
  
  return $chaine;
}


/**
 * Retourne une chaine coupée
 * Param : la chaine
 * Param : nombre max de caractères
 * @return string
 */
function tronquer_chaine($chaine, $nbCharMax) {
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
function url_rewrite_chaine($s) {
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
function urlChars( $url, $type = 'null' ) {
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
 * Supprime les accents
 * @return string
 */
function wd_remove_accents($str, $charset='utf-8') {
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
function getNomPage() {
  $nompage =  $_SERVER['PHP_SELF'];
  $nompage = explode('/',$nompage);
  $nompage = $nompage[COUNT($nompage)-1];
  return $nompage;
}




?>
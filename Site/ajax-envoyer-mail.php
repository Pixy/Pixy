<?php
header('Content-type: text/html; charset=UTF-8'); 
require_once('php_mailer/class.phpmailer.php');
include("php_mailer/class.smtp.php");

/* VARIABLES */
$email = clean_text($_POST['mail']);
$nom = (empty($_POST['nom'])) ? 'unNom' : clean_text($_POST['nom']);
$prenom = (empty($_POST['prenom'])) ? 'unPrenom' : clean_text($_POST['prenom']);
$telephone = (empty($_POST['telephone'])) ? 'unTel' : clean_text($_POST['telephone']);
$sujet = (empty($_POST['sujet'])) ? 'unSujet' : clean_text($_POST['sujet']);
$demande = (empty($_POST['demande'])) ? 'uneDemande' : clean_text($_POST['demande']);


/********************************************************/
/*               ENVOIE DU MAIL DE CONTACT              */
/********************************************************/ 


$body = 'Vous avez reçu un e-mail de contact de la part de ' . $prenom . ' ' . $nom . '.<br />
          Vous pouvez lui répondre à l\'adresse : ' . $email . '.<br /><br />
          Sa demande : <br />'
          . $demande;

$mail = new PHPMailer(true);
$mail->IsSMTP(); 
try {
  $mail->Mailer = "smtp"; 
  $mail->Host       = "smtp.googlemail.com";
  //$mail->SMTPDebug  = 2;          
  $mail->SMTPAuth   = true; 
  $mail->SMTPSecure = "ssl";     
  $mail->Port       = 465;        
  $mail->CharSet = 'utf-8';  
  $mail->Username   = "g.pierrealexis@gmail.com";  
  $mail->Password   = "dx5BTDJ12";   
  $mail->AddReplyTo($mail, $nom . ' ' . $prenom);
  $mail->AddAddress('g.pierrealexis@gmail.com', 'Plop');
  $mail->SetFrom($email, $nom . ' ' . $prenom);
  $mail->Subject = $sujet;
  $mail->AltBody = 'Si vous ne voyez pas ce message, merci d\'activer le HTML.';
  $mail->MsgHTML($body);
  $mail->Send();
  
  echo 'La demande a été correctement envoyée.';
  
} catch (phpmailerException $e) {
  echo $e->errorMessage(); //Pretty error messages from PHPMailer
} catch (Exception $e) {
  echo $e->getMessage(); //Boring error messages from anything else!
  echo 'Une erreur s\'est produite lors de l\'envoi du mail...';
}

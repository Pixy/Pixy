<?php

/***************************************/
/*             MAGIC QUOTES            */
/***************************************/

if(get_magic_quotes_gpc()) {
  $_POST = array_map('stripslashes', $_POST);
  $_GET = array_map('stripslashes', $_GET);
  $_COOKIE = array_map('stripslashes', $_COOKIE);
}


?>
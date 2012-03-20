<?php include 'header.php'; ?>
<?php include 'navigation.php'; ?>
  
  <div class="container">
    <div class="hero-unit">
      <h1>Me contacter</h1>
    
      <form class="well" id="submitor">
        <div class="row">
          <div class="span4">
            <label for="nom">Votre nom</label>
            <input type="text" name="nom" id="nom" class="span3" placeholder="Nom..." required="required">
            
            <label for="email">Votre e-mail</label>
            <input type="email" id="email" name="email" class="span3" placeholder="Email..." required="required">
            
            <label>Sujet de votre message</label>
            <input type="text" class="span3" placeholder="Sujet...">
          </div>
          
          <div class="span4">
            <label for="message">Votre message</label>
            <textarea id="message" name="message" placeholder="Message..." class="span5"></textarea>
          </div>
        </div>
        
        <p><button type="submit" class="btn btn-primary">Submit</button></p>
        
        <div id="response"></div>
      </form>
      
    </div>
    
  </div>
  
  <script type="text/javascript">
    $(function() {
      $( '#submitor' ).submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
          type: 'post',
          url: 'ajax-envoyer-mail.php',
          success: function(data, textStatus, jqXHR) {
            if(data != '0') {
              $('#response').empty().append('<div class="alert alert-error">Une erreur s\'est produite lors de l\'envoi de l\'email. Veuillez reessayer.</div>').fadeIn(500, function() {
                $(this).delay(3000).fadeOut(500);
              });
            } else {
              $('#response').empty().append('<div class="alert alert-success">L\'email a été correctement envoyé !</div>').fadeIn(500, function() {
                $(this).delay(3000).fadeOut(500);
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $('#response').empty().append('<div class="alert alert-error">Une erreur s\'est produite lors de l\'envoi de l\'email.</div>').fadeIn(500, function() {
              $(this).fadeOut(500);
            });
          }
        });
      });
    });
  </script>
  
<?php include 'footer.php'; ?>
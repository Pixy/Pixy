<?php include 'header.php'; ?>
<?php include 'navigation.php'; ?>
  
  <div class="container">
    <div class="hero-unit">
      <h1>Me contacter</h1>
    
      <form class="well">
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
      </form>
    </div>
    
  </div>
  
<?php include 'footer.php'; ?>
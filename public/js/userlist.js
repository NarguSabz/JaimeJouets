//Remplir le tableau et activer les liens lorsque le page est charger
$(document).ready(function() {

  populateTable();

  $('#itemList table tbody').on('click', 'td a.linkshowuser', showUserInfo);     

  $('#itemList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

//methode qui va remplir le tableau d'utilisateurs avec leurs informations a l'aide de jquery
function populateTable() {

  var tableContent = '';

  $.getJSON( '/admin/userlist', function( data ) {

    $.each(data, function(){
    
      tableContent += '<tr>';
      tableContent += '<td>' + this.username +'</td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + 'Montrer' + '</a></td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.username + '">Oui</a></td>';
      tableContent += '</tr>';
      
  });

    $('#itemList table tbody').html(tableContent);
  });
};

//methode qui va remplir les champs d'informations avec jquery pour un utilisateur choisis
function showUserInfo(event) {

  event.preventDefault();

  var thisUserName = $(this).attr('rel');

  $.getJSON( '/admin/userlist').done (function( data ) {
       userListData = data.map(function (item) {
      return item;
  });

  var arrayPosition = userListData.findIndex(obj => obj.username==thisUserName);

  var thisUserObject = userListData[arrayPosition];

  $('#userInfoUsername').text(thisUserObject.username);    
  $('#userInfoPrenom').text(thisUserObject.prenom);    
  $('#userInfoNom').text(thisUserObject.nom);   
  $('#userInfoEmail').text(thisUserObject.email);
  $('#userInfoAddresse').text(thisUserObject.adresse);
});
};

//methode qui va supprimer un utilisateur si l'on confirm notre choix
function deleteUser(event) {
  event.preventDefault();

 
  var confirmation = confirm('Are you sure you want to delete this user?');

  
  if (confirmation === true) {

      $.ajax({
          type: 'DELETE',
          url: '/admin/deleteuser' + $(this).attr('rel')
      }).done(function (response) {
          
          if (response.msg === '') {

          } else {
              alert('Error: ' + response.msg);
          }

         
          
      });
    populateTable();
  } else {
      
      return false;
  }
    
};
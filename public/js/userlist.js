//var $ = require("jquery");
// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the user table on initial page load
  populateTable();
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/admin/userlist', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
    
      tableContent += '<tr>';
      tableContent += '<td>' + this.username +'</td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + 'Montrer' + '</a></td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.username + '">Oui</a></td>';
      tableContent += '</tr>';
      
  });
        // Inject the whole content string into our existing HTML table        $('#userList table tbody').html(tableContent);    });};
    // Inject the whole content string into our existing HTML table
    $('#itemList table tbody').html(tableContent);
  });
};


function showUserInfo(event) {

  
  event.preventDefault();


  var thisUserName = $(this).attr('rel');
  

  $.getJSON( '/admin/userlist').done (function( data ) {
       userListData = data.map(function (item) {
      return item;
  });


  var arrayPosition = userListData.findIndex(obj => obj.username==thisUserName);

 
  // Get our User Object    
 
  var thisUserObject = userListData[arrayPosition];
  //Populate Info Box    
  $('#userInfoUsername').text(thisUserObject.username);    
  $('#userInfoPrenom').text(thisUserObject.prenom);    
  $('#userInfoNom').text(thisUserObject.nom);   
  $('#userInfoEmail').text(thisUserObject.email);
  $('#userInfoAddresse').text(thisUserObject.adresse);
});
};
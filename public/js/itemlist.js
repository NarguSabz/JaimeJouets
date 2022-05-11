//Remplir le tableau et activer les liens lorsque le page est charger
$(document).ready(function() {

  populateTable();

});

//methode qui va remplir le tableau des items avec leurs informations a l'aide de jquery
function populateTable() {

  var tableContent = '';

  $.getJSON( '/admin/itemlist', function( data ) {

    $.each(data, function(){
    
      tableContent += '<tr>';
      tableContent += '<td>' + this.numid +'</td>';
      tableContent += '<td>' + this.nom + '</td>';
      tableContent += '<td>' + this.nombrestock + '</td>';
      tableContent += '<td>' + this.prix + '</td>';
      tableContent += '</tr>';
      
  });

    $('#itemList table tbody').html(tableContent);
  });
};

$( document ).ready(function() {
    $('#buscar-conteudo').click(function(){
        var url = 'https://pdbmanager-dot-pdbenv-dev.appspot.com/promos';
        $( "#lista-promos" ).empty();
        if ('caches' in window) {
            $( "#lista-promos" ).empty();
            caches.match(url).then(function(response) {
              if (response) {
                response.json().then(function(data) {
                    var htmlList = '';
                    data.forEach(function(promo) {
                        htmlList = htmlList + '<img style="width: 50px;" src='+promo.alias+'></p>';
                    });
        
                    $( "#lista-promos" ).append( htmlList );
                });
              }
            });
          }

        $.get(url, function( data ) {
            $( "#lista-promos" ).empty();
            var htmlList = '';
            data.forEach(function(promo) {
                htmlList = htmlList + '<img style="width: 50px;" src='+promo.alias+'></p>';
            });

            $( "#lista-promos" ).append( htmlList );

        });
    });
});
(function () {
  //busca
  $("#search").on("input", function(){
    //guarda o valor diigitado, removendo espaços extras.
    var search = $(this).val().trim();
    if(search.length) {
      $(".card").hide().filter(function(){
        return $(this).find(".card-content")
          .text()
          .match(new RegExp(search, "i"));
      }).show();
    }
    else {
      $(".card").show();
    }
  });
})();

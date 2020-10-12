$(document).ready(() => {
  $('.ui.embed').embed();
  
  $('[data-fancybox="gallery"]').fancybox({
    buttons: [
      "download",
      "close"
    ]
  });
  
  $('#gallery-more-button button').click(() => {
    $(".gallery-more").css("display", "block");
    $('#gallery-more-button').css("display", "none");
  });
})
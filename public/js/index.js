
$(document).ready(() => {

  $('.ui.embed').embed();
  
  $('[data-fancybox="gallery"]').fancybox({
    buttons: [
      "download",
      "close"
    ]
  });
  
  $('.menu .item').tab();
  $('.ui.modal').modal('show')

  $('#doc-films-more-button button').click(() => {
    $(".doc-films-more").css("display", "block");
    $('#doc-films-more-button').css("display", "none");
  });

  $('#sff-more-button button').click(() => {
    $(".sff-more").css("display", "block");
    $('#sff-more-button').css("display", "none");
  });
})
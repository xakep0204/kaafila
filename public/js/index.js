
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

  $('.more-button').click(function () {
    $(`.${this.id}-more`).removeClass("more-section");
    $(this).css("display", "none");
  });
})
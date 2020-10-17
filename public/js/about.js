$(document).ready(() => {
  $('.ui.embed').embed();
  
  $('[data-fancybox="gallery"]').fancybox({
    buttons: [
      "download",
      "close"
    ]
  });
  
  $('.more-button').click(function () {
    $(`.${this.id}-more`).removeClass("more-section");
    $(this).css("display", "none");
  });
})
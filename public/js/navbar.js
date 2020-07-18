var $nav = $(".ui.borderless.menu");
var $header = $("header.hero");

$(document).ready(function() {
    $(".ui.toggle.button").click(function() {
      if (!($(document).scrollTop()+54 > $header.height())) {
        $nav.toggleClass('scrolled');
      }
      $(".mobile.only.grid .ui.vertical.menu").toggle(100);
    });

    $(".ui.dropdown").dropdown();
    $nav.toggleClass('scrolled', $(this).scrollTop()+54 > $header.height());
  });

$(function() {
  $(document).scroll(function() {
    $nav.toggleClass('scrolled', $(this).scrollTop()+54 > $header.height());
    });
});
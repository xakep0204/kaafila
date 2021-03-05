$(".ui.embed").embed();

$(".conceptnote").click(function () {
  $(`#conceptnote-modal .ui.embed`).attr("data-url", $(this).attr('data-pdfLink'))
  $(`#conceptnote-modal .ui.embed`).embed()
  $(`#conceptnote-modal`).modal("show");
})
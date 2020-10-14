$(document).ready(() => {
  $(".vote").click(function () {
    $(`#${this.id}-modal`).modal("show");
  })
  
  $("#votesubmit").click(() => {
    $("#confirmmodal").modal("show")
  })

  $(".ui.checkbox").checkbox('enable');

})
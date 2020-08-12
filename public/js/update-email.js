$("#updates form").form({
  fields: {email: email}
})


$("#updates form button").click(function(){
  if ($("#emailC").val() === "") {
    var formEmail = $("#emailM").val();
  } else {
    var formEmail = $("#emailC").val();
  }
  alert(formEmail)
  // $.post(
  //   "/updatesEmail", 
  //   {email: formEmail},
  //   function(data, status){
  //   alert("Data: " + data + "\nStatus: " + status);
  // });
});
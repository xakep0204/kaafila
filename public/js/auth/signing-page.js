function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
}

$(document).ready(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyBVLs6Abc0Nt0LyZQHlQd2NcL5y5FiLtWc",
    authDomain: "kaafila-8cc49.firebaseapp.com",
    databaseURL: "https://kaafila-8cc49.firebaseio.com",
    projectId: "kaafila-8cc49",
    storageBucket: "kaafila-8cc49.appspot.com",
    messagingSenderId: "821115427097",
    appId: "1:821115427097:web:492776918ba67392ea4d88",
    measurementId: "G-YT3TV95M5Y"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}
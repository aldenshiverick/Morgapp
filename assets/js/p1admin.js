function adminGetUser(type){
  //{{apiPath}}/environments/{{envID}}/users/?filter=username%20eq%20%22lsmith%22
  console.log('adminGetUser called');

  let method = "GET";
  //let type = type;
  let value = "";
  if(type == 'email'){
    value = document.getElementById('email').value;
    console.log(value);
  }
  if(type == 'passID'){
    value = document.getElementById('PassID').value;
    console.log(value);
  }
  if(type == 'username'){
    value = document.getElementById('username').value;
    console.log(value);
  }
  console.log(value);
  // let at = "Bearer " + Cookies.get("workerAT");
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/?filter=" + type + "%20eq%20%22" + value + "%22";
  console.log('ajax (' + url + ')');
  console.log('at =' + at);
  console.log("make ajax call");
  $.ajax({
    async: "true",
    url: url,
    method: method,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', at);
    }
  }).done(function(response) {
    console.log('response '+response);
    adminSetUserValues(response);
  });
  console.log("adminGetUser completed");
}

function adminSetUserValues(userJson) {
  console.log("adminsetuserValues was called");
  console.log(userJson);
  console.log(userJson._embedded.users[0].id);
  //make all values null 
  document.getElementById("fnameFill").value = "";
  document.getElementById("lnameFill").value = "";
  document.getElementById("emailFill").value = "";
  document.getElementById("birthday").value = "";
  document.getElementById("address").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("zip").value = "";


  Cookies.set('currentUser', userJson._embedded.users[0].id);
  if (Cookies.get("accessToken")) {
    //document.getElementById("usernameFill").value = 'Hello ' + userJson._embedded.users[0].username + "!";
    document.getElementById("usernameFill").innerHTML = 'Viewing ' + userJson._embedded.users[0].username;
    document.getElementById("username").value = userJson._embedded.users[0].username;
    if (userJson._embedded.users[0].name.given != null)
    {
      console.log('given name exisits')
      document.getElementById("fnameFill").value = userJson._embedded.users[0].name.given;
    }
    if(userJson._embedded.users[0].name.family != undefined){
      document.getElementById("lnameFill").value = userJson._embedded.users[0].name.family;
    }
    if(userJson._embedded.users[0].birthday != undefined){
      document.getElementById("birthday").value = userJson._embedded.users[0].birthday;
    }
    if(userJson._embedded.users[0].gender != undefined){
      document.getElementById("gender").value = userJson._embedded.users[0].gender;
    }
    if(userJson._embedded.users[0].address != undefined){
      document.getElementById("address").value = userJson._embedded.users[0].address.streetAddress;
    }
    if(userJson._embedded.users[0].address.locality != undefined){
      document.getElementById("city").value = userJson._embedded.users[0].address.locality;
    }
    if(userJson._embedded.users[0].address.region != undefined){
      document.getElementById("state").value = userJson._embedded.users[0].address.region;
    }
    if(userJson._embedded.users[0].address.postalCode != undefined){
      document.getElementById("zip").value = userJson._embedded.users[0].address.postalCode;
    }
    document.getElementById("emailFill").value = userJson._embedded.users[0].email;
    //document.getElementById("usernameFill").innerHTML = userJson._embedded.users[0].username;
    //document.getElementById("address").innerHTML=streetAddress;
  } else {
    document.getElementById("usernameFill").innerHTML = 'Welcome Guest';
  }
}

  function getWorkerAccessToken() {
    console.log("getWorkerAT called");
    console.log("envID: " + environmentID);
    console.log("apiURL: " + apiUrl);
    let url = authUrl + "/" + environmentID + "/as/token";
    console.log("url is " + url);
    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "data": {
        "grant_type": "client_credentials",
        "client_id": workerClientID,
        "client_secret": workerClientSecret
      }
      
    };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    setCookies(response);
  });
}

function setCookies(data){
  console.log("setcookie Called");
  console.log(data.access_token);
  let at = data.access_token;
  console.log('at is: ' + at);
  Cookies.set('workerAT', at, { sameSite: 'strict' });
}


function updateUserValues(){
  console.log("updateUserValues was called");
  let method = "PATCH";
  let user = Cookies.get("currentUser");
  //let at = "Bearer " + Cookies.get("workerAT");
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user;
  let payload = JSON.stringify({
    username: $('#username').val(),
    name: {
      given: $('#fnameFill').val(),
      family: $('#lnameFill').val()
    },
    email: $('#emailFill').val(),
    birthday: $('#birthday').val(),
    gender: $('#gender').val(),
    //relationship: 
    address: {
      streetAddress: $('#address').val(),
      locality: $('#city').val(),
      region: $('#state').val(),
      postalCode: $('#zip').val()
    },
  });
  console.log(payload);
  console.log('ajax (' + url + ')');
  console.log('at =' + at);
  console.log("make ajax call");
  $.ajax({
      async: "true",
      url: url,
      method: method,
      dataType: 'json',
      contentType: 'application/json',
      data: payload,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', at);
      }
    }).done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
  //add brief delay so info is populated
  setTimeout(function() {
    adminGetUser("username");
  }, 1000);
}
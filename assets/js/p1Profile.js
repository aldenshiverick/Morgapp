
function getUserValues() {
    console.log('getUserValues called');
    let method = "GET";
    let user = Cookies.get("userAPIid");
    console.log('UserValue is: ' + user);
    let at = "Bearer " + Cookies.get("accessToken");
    let url = apiUrl + "/environments/" + environmentID + "/users/" + user;
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
      console.log(response);
      setUserValues(response);
    });

    console.log("getUserValues completed");
  
  }
  
  function setUserValues(userJson) {
    console.log("setuserValues was called");
    console.log(userJson);
    let uuid = Cookies.get("userAPIid");
    //let streetAddress = userJson.address.streetAddress + " " + userJson.address.locality + ", " + userJson.address.region + " " + userJson.address.postalCode;
    if (Cookies.get("accessToken")) {
      if(userJson.name){
        if(userJson.name.given){
          console.log("givenname if was passes")
          document.getElementById("fname").value = userJson.name.given;
        }
        if(userJson.name.family){
        document.getElementById("lname").value = userJson.name.family;
        }
      }
      document.getElementById("email").value = userJson.email;
      //document.getElementById("username").value = userJson.username;
      document.getElementById("Hello").innerHTML = 'Welcome ' + userJson.username;
      if(userJson.rewards != null){
        //document.getElementById("daysSkied").value = userJson.daysSkied;
        document.getElementById("rewards").innerHTML = '$' + userJson.rewards;
      }
      if(userJson.birthday != null){
        document.getElementById("birthday").value =  userJson.birthday;
      }
      if(userJson.gender != null){
        document.getElementById("gender").value = userJson.gender;
      }
      // if(userJson.relationship != null){
      //   document.getElementById("relationship").value = userJson.relationship;
      // }
      if(userJson.address !=null){
        console.log("userJson.address not null is true")
        if(userJson.address.streetAddress != null){
          document.getElementById("address").value = userJson.address.streetAddress;
        }
        if(userJson.address.locality != null){
          document.getElementById("city").value = userJson.address.locality;
        }
        if(userJson.address.region != null){
          document.getElementById("state").value = userJson.address.region;
        }
        if(userJson.address.postalCode != null){
          document.getElementById("zip").value = userJson.address.postalCode;
        }
      }
      if(userJson.mfaEnabled == true){
        console.log("MFA is true");
        document.getElementById("enableMFA").checked = true;
      }
    } else {
      document.getElementById("Hello").value = 'Welcome Guest';
    }
    console.log(userJson.username);
  
    //let idPayload = parseJwt(idToken);
  }


function updateUserValues(){
  console.log("updateUserValues was called");
  let method = "PATCH";
  let user = Cookies.get("userAPIid");
  console.log('User APIid: ' + user);
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user;
  let payload = JSON.stringify({
    username: $('#username').val(),
    name: {
      given: $('#fname').val(),
      family: $('#lname').val()
    },
    birthday: $('#birthday').val(),
    //gender: $('#gender').val(),
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
    getUserValues();
  }, 1000);
}


function updatePassword(){
  console.log("updatePassword was called");
  let method = "PUT";
  let user = Cookies.get("userAPIid");
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user + "/password";
  let payload = JSON.stringify({
    currentPassword: $('#currentPass').val(),
    newPassword: $('#newPass').val()
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
      contentType: 'application/vnd.pingidentity.password.reset+json',
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
    getUserValues();
  }, 1000);
}

function updateMFA(){
  console.log("updateMFA called");
  let checked = document.getElementById("enableMFA").checked;
  console.log("checkbox value: " + checked);
  if (checked == true){
    console.log('MFA Enabled');
    enableEmailMFA();
  }
  if(checked ==) {
    console.log('MFA disabled');
    disableMFA();
  }
}

function enableEmailMFA(){
  let user = Cookies.get("userAPIid");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user + "/devices/";
  console.log("url is: " + url);
  let at = "Bearer " + Cookies.get("accessToken");
  let method = "POST";

  let payload = JSON.stringify({
    type: 'EMAIL',
    email: $('#email').val()
  }); 
  console.log('Payload: ' + payload);

  $.ajax({
    async: "true",
    url: url,
    method: method,
    contentType: 'application/json',
    data: payload,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', at);
    }
  }).done(function(data) {
    nextStep(data);
    console.log(data);
  })
  .fail(function(data) {
    console.log('ajax call failed');
    console.log(data);
    $('#warningMessage').text(data.responseJSON.details[0].message);
    $('#warningDiv').show();
  });

}
 
function OTPVerify(){
  console.log('OTPVerify called');
  let otp = $('#user_otp').val();
  let at = "Bearer " + Cookies.get("accessToken");
  let payload = JSON.stringify({
    otp: $('#user_otp').val()
  });
  let url = $('#checkOTP').val();
  console.log('url :' + url);
  console.log('verificationCode: ' + otp);

  $.ajax({
    async: "true",
    url: url,
    method: "POST",
    contentType: 'application/vnd.pingidentity.device.activate+json',
    data: payload,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', at);
    }
  }).done(function(data) {
    nextStep(data);
    console.log(data);
  })
  .fail(function(data) {
    console.log('ajax call failed');
    console.log(data);
    $('#warningMessage').text(data.responseJSON.details[0].message);
    $('#warningDiv').show();
  });
}


function disableMFA(){
  console.log("update MFA was called");
  let checked = document.getElementById("enableMFA").checked;
  console.log("checkbox value: " + checked);
  let method = "PUT";
  let user = Cookies.get("userAPIid");
  console.log('User APIid: ' + user);
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user +"/mfaEnabled";
  let payload = JSON.stringify({
      "mfaEnabled": false
    });
  console.log("payload is: " + payload);
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

}

// function enableMFA(){
//   console.log("Enable MFA was called");
//   let method = "PUT";
//   let user = Cookies.get("userAPIid");
//   console.log('User APIid: ' + user);
//   let at = "Bearer " + Cookies.get("accessToken");
//   let url = apiUrl + "/environments/" + environmentID + "/users/" + user +"/mfaEnabled";
//   let payload = JSON.stringify({
//     "mfaEnabled": true
//   });
//   console.log(payload);
//   console.log('ajax (' + url + ')');
//   console.log('at =' + at);
//   console.log("make ajax call");
//   $.ajax({
//       async: "true",
//       url: url,
//       method: method,
//       dataType: 'json',
//       contentType: 'application/json',
//       data: payload,
//       beforeSend: function(xhr) {
//         xhr.setRequestHeader('Authorization', at);
//       }
//     }).done(function(data) {
//       console.log(data);
//     })
//     .fail(function(data) {
//       console.log('ajax call failed');
//       console.log(data);
//       $('#warningMessage').text(data.responseJSON.details[0].message);
//       $('#warningDiv').show();
//     });
// }


function nextStep(data){
  status = data.status;
    console.log('Parsing json to determine next step: ' + status);
  
    switch (status) {
      case 'ACTIVATION_REQUIRED':
        console.log('Activation required');
        $('#profile').hide();
        $('#buttons').hide();
        $('#otpDiv').show();
        $('#mfacheck').hide();
        $('#passwordChange').hide();
        $('#changePassbutton').hide();
        $('#checkOTP').val(data._links["device.activate"].href);
        break;
      case 'ACTIVE':
        console.log('case: ACTIVE')
        $('#profile').show();
        $('#buttons').show();
        $('#otpDiv').hide();
        $('#mfacheck').show();
        $('#passwordChange').show();
        $('#changePassbutton').show();
        enableMFA();
        break;
        case 'OTP_REQUIRED':
        console.log('case: ACTIVE')
        $('#profile').hide();
        $('#buttons').hide();
        $('#otpDiv').show();
        $('#mfacheck').hide();
        $('#passwordChange').hide();
        $('#changePassbutton').hide();
        enableMFA();
        break;
      default:
        $('#otpDiv').hide();
        console.log('Unexpected outcome');
        break;
    }

}

function cashout(){

  
}
  
function approveRewards(){
  console.log('approveRewards called');
  let transactionclient = "8a5c089d-2277-4b9f-a3dc-a7a62e919a5b";
  let transactionPassword = "zM1MJiZeK-4WXr0_bl9y~Bi9.vmKHOwxUPPCXArtSabwmZGALVHm.NuGSbw7QJwz";
  let header ={
      "alg": "HS256",
      "typ": "JWT"
    };
  let body ={
    "aud": "https://auth.pingone.com/" + environmentID + "/as",
    "iss": transactionclient,
    "sub": $('#email').val(),
    "pi.template": {
      "name": "transaction",
      "variables": {
        "name": $('#fname').val(),
      }
    },
    "pi.clientContext": {
      "alert.color": "red"
    }
  };

  var base64object = function(data) {
  var inputWords = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  var base64 = CryptoJS.enc.Base64.stringify(inputWords);
  var output = removeIllegalCharacters(base64);
  return output;
  };
  
  var removeIllegalCharacters = function(data) {
  return data
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');
  };
  
  // Create Signed JWT
  var unsignedToken = base64object(header) + "." + base64object(body);
  //console.log("insigned token: " + unsignedToken);
  var signatureHash = CryptoJS.HmacSHA256(unsignedToken, transactionPassword);
  var signature = CryptoJS.enc.Base64.stringify(signatureHash);
  var signature2 = removeIllegalCharacters(signature);
  //console.log("signiture: "+signature2);
  var jwtToken = unsignedToken + '.' + signature2;
  console.log(jwtToken);
  let url = authUrl+ "/" + environmentID + "/as/authorize?response_type=token id_token&client_id=" + transactionclient +"&response_mode=pi.flow&scope=openid&request=" + jwtToken;
  let contenttype ='application/json';
  console.log('url: ' + url );
  let method = 'GET';
  $.ajax({
    url: url,
    method: method,
    async:true,
    crossDomain:true,
    xhrFields: {
      withCredentials: true
    }
    //dataType: 'jsonp'
  })
  .done(function(data) {
    nextStep(data);
  })
  .fail(function(data) {
    console.log('ajax call failed');
    console.log(data);
    $('#warningMessage').text(data.responseJSON.details[0].message);
    $('#warningDiv').show();
  });

exJax('POST',url,nextStep,contenttype);
}


function updateRewards(){
  console.log("updateRewards  was called");
  let method = "PATCH";
  let user = Cookies.get("userAPIid");
  console.log('User APIid: ' + user);
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentID + "/users/" + user;
  let payload = JSON.stringify({
    "rewards": "0"
  });
  console.log(payload);
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
    }).done(function(data) {
      nextStep(data);
      console.log("made ajax call " +data);
    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });

}


// function base64url(source) {
//   // Encode in classical base64
//   encodedSource = btoa(source);

//   // Remove padding equal characters
//   encodedSource = encodedSource.replace(/=+$/, '');

//   // Replace characters according to base64url specifications
//   encodedSource = encodedSource.replace(/\+/g, '-');
//   encodedSource = encodedSource.replace(/\//g, '_');

//   return encodedSource;
// }



//-----Self Service Profile calls --//

function updateUser() {
  console.log("updateUser was called");
  let method = "PATCH";
  let user = Cookies.get("uuid");
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentId + "/users/" + user;
  let payload = JSON.stringify({
    username: $('#username').val(),
    name: {
      given: $('#fname').val(),
      family: $('#lname').val()
    }
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
      xhrFields: {
        withCredentials: true
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

function getUserValues() {
  console.log('getUserValues called');
  let method = "GET";
  let user = Cookies.get("uuid");
  let at = "Bearer " + Cookies.get("accessToken");
  let url = apiUrl + "/environments/" + environmentId + "/users/" + user;
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
  console.log("getUserValues completed")

}


function getValueFromJson(obj, label) {
  if (obj.label === label) {
    return obj;
  }
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      let foundLabel = findObjectByLabel(obj[i], label);
      if (foundLabel) {
        return foundLabel;
      }
    }
  }
  return null;
}
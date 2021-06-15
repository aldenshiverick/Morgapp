// build the authorization url in case we need it

const authorizationUrl =
  authUrl +
  '/' +
  environmentID +
  '/as/authorize?client_id=' +
  appClientID +
  '&response_type=' +
  responseType +
  '&redirect_uri=' +
  redirectUri +
  '&scope=' +
  scopes;
  
  //+
  //'&response_mode=pi.flow';




  function setUserinfoCookie() {  //put the AT and uuid somewhere handy --> bad coding :)
    let idToken = Cookies.get('idToken');
    let idPayload = parseJwt(idToken);
    Cookies.set('userAPIid', idPayload.sub);
    //Cookies.set('name', idPayload.given_name);
  }

//----initate logon ---- //
// function initiateLogon() {
//     console.log('initiateLogon called')
//     let url = authorizationUrl;
//     let method = 'GET'
//     $.ajax({
//       url: url,
//       method: method
//     })
//     .done(function(data) {
//       nextStep(data);
//     })
//     .fail(function(data) {
//       console.log('ajax call failed');
//       console.log(data);
//       $('#warningMessage').text(data.responseJSON.details[0].message);
//       $('#warningDiv').show();
//     });
//   }

function initiateLogon(){
  location.href = authorizationUrl;
}


  // function finishLogon(url){
  //     //get to redirect to get user info 
  //     console.log('finishLogon called')
  //     let method = 'GET'
  //     console.log('url is: '+ url);
  //     //exJax('GET', url, nextStep);
  //     $.ajax({
  //       url: url,
  //       method: method,
  //       xhrFields: {
  //           withCredentials: true
  //       }
  //     })
  //     .done(function(data) {
  //       setCookies(data);
  //     })
  //     .fail(function(data) {
  //       console.log('ajax call failed');
  //       console.log(data);
  //       $('#warningMessage').text(data.responseJSON.details[0].message);
  //       $('#warningDiv').show();
  //     });
  // }

  function finishLogon(url){
    console.log('finishLogon called');
    console.log('Redirect to: '+ url);
    location.href = url;

    
  }

  // getUrlParameter function parses out the querystring to fetch specific value (e.g., flowId)
function getUrlParameter () {
  console.log('getUrlParameter was called');
  let pageUrl = window.location.href;
  const pound = 'access_toke'
  const q = '?';
  console.log('pageUrl: ' + pageUrl);
  if (pageUrl.includes(pound)) {
    console.log('pageUrl is not null and has #');
    //pageUrl = pageUrl.substring(pageUrl.indexOf(pound) + 1);
    const urlVariables = pageUrl.split('&');
    console.log('urlVariables: ' + urlVariables);
    for (let i = 0; i < urlVariables.length; i++) {
      const thisParameterName = urlVariables[i].split('=');
      // if (thisParameterName[0] ==  parameterName) {
      //   console.log('parameterName:' + thisParameterName[1]);
      //   return thisParameterName[1];
      // }
      if (thisParameterName[0].includes('access_token')) {
        console.log('setting at cookie : ' + thisParameterName[1]);
        Cookies.set('accessToken', thisParameterName[1]);
      }
      if (thisParameterName[0].includes('id_token')) {
        console.log('setting id cookie : ' + thisParameterName[1]);
        const idToken = thisParameterName[1];
        Cookies.set('idToken', idToken);
        setUserinfoCookie();
      }

      console.log(thisParameterName);
    }
  } else if (pageUrl.includes(q)) {
    console.log("pageUrl is not null");
    pageUrl = pageUrl.substring(pageUrl.indexOf(q) + 1);
    console.log("removed base at ?:" + pageUrl);
    let urlVariables = pageUrl.split('&');

    console.log("urlVariables: " + urlVariables);
    for (let i = 0; i < urlVariables.length; i++) {
      console.log("if statement to set flowID");
      let thisParameterName = urlVariables[i].split('=');
        flowId = thisParameterName[1];
      }
    }
   else {
    console.log("URLparams are not present");
    return "";
  }
  console.log("getURLParms done");
}

function getNextStep(flowID){
  console.log('getNextStep called');
  let flowUrl = authUrl + '/' + environmentID + '/flows/' + flowId;
  exJax('GET', flowUrl, nextStep, 'application/json');
}


  function setCookies(data){
      console.log("setcookie Called");
      console.log(data);
      let userAPIid = data._embedded.user.id;
      console.log('user is: ' + userAPIid);
      let accessToken = data.authorizeResponse.access_token
    Cookies.set('userAPIid', userAPIid,{ sameSite: 'strict' });
    Cookies.set('accessToken', accessToken, { sameSite: 'strict' });
    window.location.replace(baseUrl);
  }
  

  function errorCode(data){
    console.log("Error code reponse");
      var message = document.getElementById('errorcode');
      let code = data.details[0].code;
      console.log("code from error" + code);
      console.log("code is not null");
      message.innerHTML=code;
  }
   //----What should we do? ----//
   function nextStep(data) {
    status = data.status;
    console.log('Parsing json to determine next step: ' + status);
    flowId= data.id;
    console.log('FlowId is: ' + flowId);
  
    switch (status) {
      case 'USERNAME_PASSWORD_REQUIRED':
        console.log('Rendering login form');
        $('#loginDiv').show();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#validatePasswordUrl').val(data._links['usernamePassword.check'].href);
        //$('#registerUserUrl').val(data._links['registration.external'].href);
        $('#validatePasswordContentType').val('application/vnd.pingidentity.usernamePassword.check+json');
        $('#forgotPasswordURL').val(data._links["password.forgot"].href);
        $('#idfirst').hide();
        //$('#socialLoginUrl').val(data._embedded.socialProviders[0]._links.authenticate.href);
        if ("socialProviders" in data._embedded){
          console.log("social exists");
          let count = Object.keys(data._embedded.socialProviders).length;
          console.log("There are " + count +" social providers");
          for(i=0; i<count; i++){
            console.log("i is: " + i);
            console.log("Add " + data._embedded.socialProviders[i].name);
            console.log("logon url: " + data._embedded.socialProviders[i]._links.authenticate.href);
            if(i==0){
              console.log("i = 0");
              $('#socialLoginUrl0').val(data._embedded.socialProviders[0]._links.authenticate.href);
            }
            if(i==1){
              console.log("i = 1");
              $('#socialLoginUrl1').val(data._embedded.socialProviders[1]._links.authenticate.href);
            }
            //$('#socialLoginUrl' + i).val(data._embedded.socialProviders[i]._links.authenticate.href);
            $('urlid').val(data._embedded.socialProviders[i]._links.authenticate.href);
            document.getElementById("socialButton"+i).style.visibility ="visible";
            document.getElementById("socialButton" +i).innerHTML = 'Signon With ' + data._embedded.socialProviders[i].name;
          }
        }
        //$('#partnerLoginUrl').val(data._embedded.socialProviders[1]._links.authenticate.href);
        $('#ppDiv').hide('');
        break;
      case 'SIGN_ON_REQUIRED':
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').hide();
        $('#userlookup').val(data._links['user.lookup'].href);
        $('#ppDiv').hide('');
        $('#idfirst').show();
        break;
      case 'VERIFICATION_CODE_REQUIRED':
        console.log('Rendering Verification code form');
        $('#loginDiv').hide();
        $('#otpDiv').show();
        $('#pushDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').hide();
        $('#verifyUserUrl').val(data._links['user.verify'].href);
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'PASSWORD_REQUIRED':
        console.log('Rendering login form');
        $('#loginDiv').show();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').hide();
        $('#validatePasswordUrl').val(data._links['usernamePassword.check'].href);
        $('#validatePasswordContentType').val('application/vnd.pingidentity.usernamePassword.check+json');
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'OTP_REQUIRED':
        console.log('Rendering otp form');
        $('#loginDiv').hide();
        $('#otpDiv').show();
        $('#pushDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').hide();
        $('#validateOtpUrl').val(data._links['otp.check'].href);
        $('#validateOtpContentType').val('application/vnd.pingidentity.otp.check+json')
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'PUSH_CONFIRMATION_REQUIRED':
        console.log('Rendering wait for push form');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').show();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pushResumeUrl').val(data._links["device.select"].href);
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'MUST_CHANGE_PASSWORD':
        console.log('Rendering password form');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#changePasswordDiv').show();
        $('#changePasswordUrl').val(data._links['password.reset'].href);
        $('#changePasswordContentType').val('application/vnd.pingidentity.password.reset+json')
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'RECOVERY_CODE_REQUIRED':
      console.log('Rendering password form');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pwResetCodeDiv').show();
        $('#changePasswordUrl').val(data._links['password.recover'].href);
        $('#pwcodeUrl').val(data._links['password.sendRecoveryCode'].href);
        $('#changePasswordContentType').val('application/vnd.pingidentity.password.reset+json')
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        break;
      case 'COMPLETED':
        console.log('completed authentication successfully');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#warningMessage').text('');
        $('#warningDiv').hide();
        $('#ppDiv').hide('');
        $('#idfirst').hide();
        //console.log('Finish logon called');
        console.log(data);
        console.log('resueme url is: '+ data.resumeUrl);
        //window.location.replace(data.resumeUrl);
        finishLogon(data.resumeUrl);
        break;
      case 'PROFILE_DATA_REQUIRED':
      console.log('rendering PP form');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#warningMessage').hide('');
        $('#warningDiv').hide();
        $('#ppDiv').show();
        $('#ppURL').val(data._links["user.update"].href);
        $('#labelID1').val(data._embedded.attributes[0].name);
        $('#labelID2').val(data._embedded.attributes[1].name);
        $('#idfirst').hide();
        getPPValues(data);
        
      break;
      default:
        console.log('Unexpected outcome');
        break;
    }
  }
  
  
  
  //-----Authentication related methods -----//
  
  //--------First Factor------//
  
  // change password function
  function changePassword() {
    console.log('changePassword called');
    let payload = JSON.stringify({
      currentPassword: $('#current_password').val(),
      newPassword: $('#change_new_password').val()
    });
    let url = $('#changePasswordUrl').val();
    let contenttype = 'application/vnd.pingidentity.password.reset+json';
    console.log('payload '+ payload);
    exJax('POST', url, nextStep, contenttype, payload);
  }
  
  // validate password function
  function validatePassword() {
    console.log('validatePassword called');
    let payload = JSON.stringify({
      username: $('#user_login').val(),
      password: $('#user_pass').val()
    });
    console.log('payload is ' + payload);
    let url = $('#validatePasswordUrl').val();
    //let url = (authUrl + environmentID + '/flows/' + flowId);
    console.log('url is: ' + url);
    let contenttype = 'application/vnd.pingidentity.usernamePassword.check+json';
    console.log('contenttype is ' + contenttype);
    exJax('POST', url, nextStep, contenttype, payload);
  }
  

  function resetPasswordDiv(){
    
  }


//used for MFA only flow
  function userLookup(){
    console.log("passwordless was called");
    let method = "POST";
    let user = $('#userid').val();
    let url = $('#userlookup').val();
    let contentType='application/vnd.pingidentity.user.lookup+json';
    console.log('url (' + url + ')');
    console.log('user =' + user);
    console.log("make exJax call");
    let payload = JSON.stringify({
      username: user
    });
    exJax(method, url, nextStep, contentType, payload);
    console.log("resetPassword finished");
  }
  

  function resetPassword(){
    //https://api.pingone.com/v1/environments/7334523a-4a2d-4dd6-9f37-93c60114e938/users/bfd0e265-abe6-41c9-aca6-2352478b30da/password
    console.log("resetPassword was called");
    let method = "POST";
    let user = $('#user_login').val();
    let url = $('#forgotPasswordURL').val();
    let contentType='application/vnd.pingidentity.password.forgot+json';
    console.log('url (' + url + ')');
    console.log('user =' + user);
    console.log("make exJax call");
    let payload = JSON.stringify({
      username: user
    });
    exJax(method, url, nextStep, contentType, payload);
    console.log("resetPassword finished");
  }
  
  
  function validatePWResetCode(){
    console.log("validate password code called ")
    let method = "POST";
    let url = $('#forgotPasswordURL').val();
    let contentType='application/vnd.pingidentity.password.recover+json';
    console.log('url (' + url + ')');
    console.log("make exJax call");
    let payload = JSON.stringify({
      recoveryCode: $('#pwReset_Code').val(),
      newPassword: $('#new_password').val()
    });
      console.log('payload =' + payload);
    exJax(method, url, nextStep, contentType, payload);
    console.log("validate Password code finished");
  
  }
  
  //-------Redirect to Registration------//
  function redirect_toReg(){
    Cookies.set('flowID', flowId, {sameSite: 'strict'});
    console.log('flowID cookeis set? ' + flowId);

    location.href = baseUrl+ '/registration.html';
  }


  function redirect_toSocial(num){
    Cookies.set('flowID', flowId, {sameSite: 'strict'});
    console.log('flowID cookeis set? ' + flowId);
    console.log("Redirect to social number:" + num);
    
    
    if(num == 0){
      console.log('social URL: ' + $('#socialLoginUrl0').val());
      location.href = $('#socialLoginUrl0').val();
    }
    if(num == 1){
      console.log('social URL: ' + $('#socialLoginUrl1').val());
      location.href = $('#socialLoginUrl1').val();
    }
    //location.href = $('#socialLoginUrl').val();
  }
  
  //-------MFA Calls -------//
  // validate one time passcode function
  function validateOTP() {
    console.log('validateOtp called');
    let otp = $('#otp_login').val();
    let payload = JSON.stringify({
      otp: otp
    });
    //let url = $('#validateOtpUrl').val();
    let url = (authUrl + '/' + environmentID + '/flows/' + flowId);
    let contenttype ='application/vnd.pingidentity.otp.check+json';
    //$('#validateOtpContentType').val();
    console.log('url :' + url);
    console.log('otp: ' + otp);
    console.log('content' + contenttype);
  
    exJax('POST', url, nextStep, contenttype, payload);
  }
  
  function continue_push() {
    //location.href=authUrl + '/' + environmentID + '/flows/' + flowId;
    console.log('continue push called');
    //let url = $('#pushResumeUrl');
    let url = authUrl + '/' + environmentID + '/flows/' + flowId;
    let contenttype ='application/json';
    //location.href = $('#pushResumeUrl').val();
    console.log('url ' + url);
    exJax('GET', url, nextStep, contenttype);
  }
  


   //------------ Progessive Profiling -----//
 function getPPValues(data){
  console.log('getPPValues called');
  document.getElementById("prompt").innerHTML = data._embedded.promptText;
  document.getElementById("label1").innerHTML = data._embedded.attributes[0].displayName;
  document.getElementById("label2").innerHTML = data._embedded.attributes[1].displayName;
  document.getElementById("labelID1").innerHTML = data._embedded.attributes[0].name;
  document.getElementById("labelID2").innerHTML = data._embedded.attributes[1].name;
  console.log('labelID1: ' + data._embedded.attributes[0].name);
  console.log('labelID2: ' + data._embedded.attributes[1].name);
}
function setPPValues(){
  let url = $('#ppURL').val();
  let method = "POST";
  console.log('URL: ' + url);
  let contentType = "application/vnd.pingidentity.user.update+json";
  let labelID1 = $('#labelID1').val();
  let labelID2 = $('#labelID2').val();
  let values = "";

  console.log("labelID1: " + $('#labelID1').val());
  if(labelID1.includes(".") && labelID2.includes(".")){
    console.log("is a JSON");
    let object1 = labelID1.substring(0, labelID1.indexOf('.'));
    let object2 = labelID2.substring(0, labelID2.indexOf('.'));
    //console.log("label1 substring: " + labelID1.substring(0, labelID1.indexOf('.')) + "label2 substring" + labelID2.substring(0,labelID2.indexOf('.')));
    console.log("Objec1: " + object1 + "object2: " + object2);
    if(object1 == object2){
      console.log("Object matches!");
      let objval1 = labelID1.substring(labelID1.indexOf(".")+1);
      let objval2 = labelID2.substring(labelID2.indexOf(".")+1);
      values = "{ \"" + object1 + "\" : { \"" + objval1 + "\" : \"" + $('#value1').val() + "\" , \"" + objval2 + "\" : \"" + $('#value2').val() + "\" } }";
      console.log("Values: " + values);
      // values = JSON.stringify({
      //   object1: {
      //     objval1: $('#value1').val(),
      //     objval2: $('#value2').val()
      //   }
      // });

      //values = object1 + ":{" + objval1 + ":" + $('#value1').val() +"," + objval2 + ":" + $('#value2').val() + "}";
      //values = labelID1.substring(0,'.') + "{" + labelID1.substring('.') + ":" + $('#value1').val() + "," + labelID2.substring(0,'.') + labelID2.substring('.') + ":" + $('#value2').val() + "}";
    }
  }
  else{
    console.log("not a JSON");
    //values = $('#labelID1').val() + ":" + $('#value1').val() +"," + $('#labelID2').val() +":" + $('#value2').val();
    values="{ \"" + labelID1 + "\" : \"" + $('#value1').val() + "\" , \"" + labelID2 + "\" : \"" + $('#value2').val() + "\" }";
  }
  // console.log("Values: "+ values);
  // // let payload = JSON.stringify({
  // //     values
  // // });
  // console.log('payload: ' + values);

  exJax(method, url, nextStep, contentType, values);
}
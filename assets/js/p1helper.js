//p14C Variables
const environmentID = '3654e138-9293-4991-8ecc-f3520e4155cc'; // env ID from p1 console
const baseUrl = 'https://morgapp.ping-eng.com/Morgapp'; //Where this app is hosted --> No trailing slash needed

const workerClientID = '5a39dc99-c9c6-4829-9afd-b71b3efe3ce2'; //used to create/manage users
//const workerClientSecret = 'UYPFyy6jOIL8HPKTqDgtmz.uqTNyrhP7MY63kMUgqq_G3~VzIuV.qU2sREl86TiO';

const appClientID = 'f876a5d5-6be4-46b9-99ab-f13e2ef955ff'; //used for enduser logon experience
//const appClientSecret ='O6KAnh~0cYTbP5QPeib~XmK8979QlDHl4amUEiWsB~5k1oRrzCUGJf4G79pzyCUi'; //used for out of band transaction approvals

//const agentClientID ='fec0bfde-63b0-4256-bff7-46105dbd2497'; //user for agent/admin logon experience
const agentClientID ='7e80217e-4283-4bf1-830f-ea6bc2fdf4ec'; //user for agent/admin logon experience

//----------------------------------------------------------------------------------------------------//


const scopes = 'openid profile email address phone p1:update:user p1:read:user p1:reset:userPassword p1:read:userPassword p1:validate:userPassword p1:create:device p1:update:device p1:read:device p1:delete:device p1:update:userMfaEnabled'; // default scopes to request
const responseType = 'token id_token'; // tokens to recieve

const landingUrl = baseUrl + '/index.html'; // url to send the person once authentication is complete
//const logoutUrl = baseUrl + '/logout/'; // whitelisted url to send a person who wants to logout
const redirectUri = baseUrl + '/login.html'; // whitelisted url P14C sends the token or code to
const adminRedirect = baseUrl +'/adminlogon.html'; //redirect uri for admin
const logoffRedirect = baseUrl + '/index.html'; //redirect after signoff

const authUrl = 'https://auth.pingone.com';
const apiUrl = 'https://api.pingone.com/v1';

var flowId = '';

const regexLower = new RegExp('(?=.*[a-z])');
const regexUpper = new RegExp('(?=.*[A-Z])');
const regexNumeric = new RegExp('(?=.*[0-9])');
const regexSpecial = new RegExp('(?=.*[~!@#\$%\^&\*\)\(\|\;\:\,\.\?\_\-])');
const regexLength = new RegExp('(?=.{8,})');
const logoutUrl = authUrl + "/" + environmentID + "/as/signoff?post_logout_redirect_uri=" + logoffRedirect + "&id_token_hint";


// simple function to parse json web token
function parseJwt(token) {
    console.log("parseJWT was called");
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
  
  // function to generate random nonce
  
  function generateNonce(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:;_-.()!';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  
  if (!appClientID || !environmentID) {
  
    alert('Be sure to edit js/auth.js with your environmentID and clientId');
  
  }
  
  
  // exJax function makes an AJAX call
  function exJax(method, url, callback, contenttype, payload) {
    console.log('ajax (' + url + ')');
    console.log("content type: "+contenttype);
    $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        contentType: contenttype,
        data: payload,
        xhrFields: {
          withCredentials: true
        }
      })
      .done(function(data) {
        console.log(data);
        callback(data);
      })
      .fail(function(data) {
        console.log('ajax call failed');
        console.log(data);   
        $('#warningMessage').text(data.responseJSON.details[0].message);
        $('#warningDiv').show();
      });
  }

  function session(){
    if (Cookies.get('accessToken') && Cookies.get('idToken')) {
      console.log("Cookies exisit show logoff button");
      $('#authbutton').text='Logout';
      // document.getElementById('authbutton').innerHTML = '<a href="' + logoutUrl + Cookies.get("idToken") + '">LogOff</a>';
      document.getElementById('authbutton').innerHTML =  '<a onclick="signoff()">SignOff</a>';

    }
    else {
      console.log("cookies don't exist show login");
      $('#authbutton').text='Login';
      document.getElementById('authbutton').innerHTML = '<a href="' + landingUrl + '">Login</a>';
    }
  }

  function signoff(){
    let redirect = logoutUrl + "=" + Cookies.get("idToken");
    Cookies.remove('idToken');
    Cookies.remove('accessToken');
    Cookies.remove('userAPIid');

    console.log("Logout redirect is: "+redirect);
    window.location.replace(redirect);
  }
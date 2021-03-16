//p14C Variables
const environmentID = '824bb550-6f42-4682-8700-3b6496b113ec'; // env ID from p1 console
const baseUrl = 'https://morgapp.ping-eng.com/retailmenotDemo'; //Where this app lives

const scopes = 'openid profile email address phone p1:update:user p1:read:user p1:reset:userPassword p1:read:userPassword p1:validate:userPassword p1:create:device p1:update:device p1:read:device p1:delete:device p1:update:userMfaEnabled'; // default scopes to request
const responseType = 'token id_token'; // tokens to recieve

const landingUrl = baseUrl + '/index.html'; // url to send the person once authentication is complete
const logoutUrl = baseUrl + 'logout/'; // whitelisted url to send a person who wants to logout
const redirectUri = baseUrl + '/login.html'; // whitelisted url P14C sends the token or code to

const workerClientID = '6d89d5da-dce5-4f54-a3bd-8fb8f2b7e9a7'; //used to create/manage users
const workerClientSecret = '5z.Y8n7nrPwOPLv6_iut4t.Yt1o-nXtD3.W6bhhmTPJDg4UQrbPFIELzozDBxkHp';

const appClientID = 'b1b4715a-6e30-45b4-b622-c54a315432a2';
const authUrl = 'https://auth.pingone.com';
const apiUrl = 'https://api.pingone.com/v1';

const agentClientID ='a7c842a3-cbde-406a-b9b6-b48aecec9ed9';
//const agentWorkerApp ='';
//const agentWorkerSecret = '';



var flowId = '';

const regexLower = new RegExp('(?=.*[a-z])');
const regexUpper = new RegExp('(?=.*[A-Z])');
const regexNumeric = new RegExp('(?=.*[0-9])');
const regexSpecial = new RegExp('(?=.*[~!@#\$%\^&\*\)\(\|\;\:\,\.\?\_\-])');
const regexLength = new RegExp('(?=.{8,})');

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
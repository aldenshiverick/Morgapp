//p14C Variables
const environmentID = '5d354632-b644-4d3e-a32e-af055f215ef8'; // env ID from p1 console
const baseUrl = 'https://morgdemo.ping-eng.com/sharep1ui'; //Where this app is hosted --> No trailing slash needed

const workerClientID = '7e80217e-4283-4bf1-830f-ea6bc2fdf4ec'; //used to create/manage users
const workerClientSecret = 'UYPFyy6jOIL8HPKTqDgtmz.uqTNyrhP7MY63kMUgqq_G3~VzIuV.qU2sREl86TiO';

const appClientID = '153f06e7-b750-447c-8626-cd90d992bcc2'; //used for enduser logon experience
//const appClientSecret ='O6KAnh~0cYTbP5QPeib~XmK8979QlDHl4amUEiWsB~5k1oRrzCUGJf4G79pzyCUi'; //used for out of band transaction approvals

//const agentClientID ='fec0bfde-63b0-4256-bff7-46105dbd2497'; //user for agent/admin logon experience
const agentClientID ='7e80217e-4283-4bf1-830f-ea6bc2fdf4ec'; //user for agent/admin logon experience


//haveibeenpwned 
const pwnedKey = "2993a27deafa41d0b8456caf96518aa1";
//----------------------------------------------------------------------------------------------------//


const scopes = 'openid profile email address phone p1:update:user p1:read:user p1:reset:userPassword p1:read:userPassword p1:validate:userPassword p1:create:device p1:update:device p1:read:device p1:delete:device p1:update:userMfaEnabled'; // default scopes to request
const responseType = 'token id_token'; // tokens to recieve

const landingUrl = baseUrl + '/index.html'; // url to send the person once authentication is complete
const logoutUrl = baseUrl + '/logout/'; // whitelisted url to send a person who wants to logout
const redirectUri = baseUrl + '/login.html'; // whitelisted url P14C sends the token or code to
const adminRedirect = baseUrl +'/adminlogon.html'; //redirect uri for admin

const authUrl = 'https://auth.pingone.com';
const apiUrl = 'https://api.pingone.com/v1';

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


  // Sha 1 code 
  /**
* Secure Hash Algorithm (SHA1)
* http://www.webtoolkit.info/
**/
function SHA1(msg) {
  function rotate_left(n,s) {
  var t4 = ( n<<s ) | (n>>>(32-s));
  return t4;
  };
  function lsb_hex(val) {
  var str='';
  var i;
  var vh;
  var vl;
  for( i=0; i<=6; i+=2 ) {
  vh = (val>>>(i*4+4))&0x0f;
  vl = (val>>>(i*4))&0x0f;
  str += vh.toString(16) + vl.toString(16);
  }
  return str;
  };
  function cvt_hex(val) {
  var str='';
  var i;
  var v;
  for( i=7; i>=0; i-- ) {
  v = (val>>>(i*4))&0x0f;
  str += v.toString(16);
  }
  return str;
  };
  function Utf8Encode(string) {
  string = string.replace(/\r\n/g,'\n');
  var utftext = '';
  for (var n = 0; n < string.length; n++) {
  var c = string.charCodeAt(n);
  if (c < 128) {
  utftext += String.fromCharCode(c);
  }
  else if((c > 127) && (c < 2048)) {
  utftext += String.fromCharCode((c >> 6) | 192);
  utftext += String.fromCharCode((c & 63) | 128);
  }
  else {
  utftext += String.fromCharCode((c >> 12) | 224);
  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
  utftext += String.fromCharCode((c & 63) | 128);
  }
  }
  return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
  j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
  msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
  word_array.push( j );
  }
  switch( msg_len % 4 ) {
  case 0:
  i = 0x080000000;
  break;
  case 1:
  i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
  break;
  case 2:
  i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
  break;
  case 3:
  i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
  break;
  }
  word_array.push( i );
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
  for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
  for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
  A = H0;
  B = H1;
  C = H2;
  D = H3;
  E = H4;
  for( i= 0; i<=19; i++ ) {
  temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
  E = D;
  D = C;
  C = rotate_left(B,30);
  B = A;
  A = temp;
  }
  for( i=20; i<=39; i++ ) {
  temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
  E = D;
  D = C;
  C = rotate_left(B,30);
  B = A;
  A = temp;
  }
  for( i=40; i<=59; i++ ) {
  temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
  E = D;
  D = C;
  C = rotate_left(B,30);
  B = A;
  A = temp;
  }
  for( i=60; i<=79; i++ ) {
  temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
  E = D;
  D = C;
  C = rotate_left(B,30);
  B = A;
  A = temp;
  }
  H0 = (H0 + A) & 0x0ffffffff;
  H1 = (H1 + B) & 0x0ffffffff;
  H2 = (H2 + C) & 0x0ffffffff;
  H3 = (H3 + D) & 0x0ffffffff;
  H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
  return temp.toLowerCase();
 }
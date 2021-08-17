//<--------- haveibeenpwned stuff ------------->

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
    let at = response.access_token;
    Cookies.set('workerAT', at, { sameSite: 'strict' });
    });
  }
  
  
  function getUserID(){
    console.log('GetUserID called');
  
    let method = "GET";
    let value = $('#user_login').val();
    console.log(value);
    let type ="username";
    let at = "Bearer " + Cookies.get("workerAT");
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
    }).done(function(data) {
      console.log("this is the data:" + data);
      Cookies.set('userId', data._embedded.users[0].id);
      pwned("USER");
      
    })
    //add catch for user not exisiting
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);   
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
  
    console.log("GetUserID completed");
    
  }
  
  function checkpwned(type){
    let password = $('#user_pass').val();
    if (type === 'reset'){
        console.log("type reset get new pass");
        password = $('#new_password').val();
    }
    if(type == 'change'){
      console.log("type reset get new pass");
      password = $('#newPass').val();
    }
    console.log('password org: ' + password);
    password = encode(password);
    console.log('password hashed: ' + password);
    let method = 'GET';
    let pwdString = password.substring(0,5);
    console.log('first 5 is: ' + pwdString);
    let url = "https://api.pwnedpasswords.com/range/" + pwdString;
    $.ajax({
      async: "true",
      url: url,
      method: method,
      // headers: { 'hibp-api-key:': pwnedKey }
    })
    .done(function(data) {
      console.log(data);
      parsepwned(data,password,type);
    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data,password);   
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
  
  }
  
  function parsepwned(data,password,type){
    let pwdstring= password.substring(5,password.length+1);
    pwdstring=pwdstring.toUpperCase();
    //let pwdArry = data.split("\n");
    //let pwdArry = data.split("/\r?\n/");
    let result = "SAFE";
    console.log("check agaisnt: " +pwdstring);
    let pwdArry = data.split("\n");
    for (i=0; i<pwdArry.length; i++){
      let value = pwdArry[i];
      console.log("current value: " + value);
      if(value.includes(pwdstring)){
        console.log("BREACHED");
        result="BREACHED";
        break;
      }
    }
    console.log("parse done result: " +result + "type is: " +type);
    if (type === 'reset'){
        console.log("senfing to resetPwned");
         resetPwned(result);
    }
    else{
        pwned(result); 
    }
    
    // console.log("password array1: " + pwdArry);
    // console.log("password short string1: " + pwdstring);
    // if (data.includes(pwdstring)){
    //   console.log("BREACHED");
    //   pwned("BREACHED");
    // }
    // else {
    //   console.log("safe!!!!");
    //   pwned("SAFE");
    //   //validatePassword();
    // }
  }
  
  function checkPassword() {
    console.log('checkPassword called');
    console.log('password is ' + $( "#user_pass" ).val());
    //console.log('password is ' + pwd);
  
    let payload = JSON.stringify({
      password: $("#user_pass").val()
    });
    let userID = Cookies.get('userId');
    //let userID = getUserID();
    let method = "POST";
    let url = apiUrl + "/environments/" + environmentID + "/users/" + userID + "/password";
    console.log("this is the check password url: " +url);
    console.log('payload is ' + payload);
    let at = "Bearer " + Cookies.get('workerAT');
    $.ajax({
      async: "true",
      url: url,
      method: method,
      dataType: 'json',
      contentType: 'application/vnd.pingidentity.password.check+json',
      data: payload,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', at);
      }
    }).done(function(data) {
      console.log(data);
      if(response = "200"){
        console.log("password correct");
        //return "correct";
        //checkpwned();
        pwned("VALIDPWD");
      }
    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);   
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
  }
  
//   function pwned(status){
//     console.log("pwned fucntion called");
//     console.log("pwned status: " + status);
  
//     switch (status) {
//       case 'START':
//         console.log("pwned START");
//         getUserID();
//         break;
//       case 'USER':
//         console.log("pwned USER");
//         checkPassword();
//         break;
//       case 'VALIDPWD':
//         console.log("pwned VALIDPWD");
//         checkpwned();
//         break;
//       case 'SAFE':
//         console.log("pwned SAFE");
//         validatePassword();
//         break;
//       case 'BREACHED':
//         console.log("pwned BREACHED");
//         resetPassword("breached");
//         break;
//       default:
//         console.log('Unexpected outcome');
//         break;
//     }
//   }
  
  function debounce( callback, delay ) {
    let timeout;
    console.log("debounce called")
    return function() {
        clearTimeout( timeout );
        timeout = setTimeout( callback, delay );
    }
  }
  
  
  // Sha 1 code 
    /**
  * Secure Hash Algorithm (SHA1)
  * http://www.webtoolkit.info/
  **/
  function encode(msg) {
      console.log("enconding: " + msg);
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
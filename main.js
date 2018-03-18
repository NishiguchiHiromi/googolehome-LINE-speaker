var http = require('http'),
    port = 3010,//ポート番号
    // ターミナルで　ngrok http 3010
    ipadress = 'localhost',//IPアドレス
    fs = require('fs'); //httpモジュール呼び出し

var server = http.createServer();

server.on('request', function (req, res) {
    var body='';
    req.on('data', function (data) {
        body +=data;
    });
    req.on('end',function(){
        const webhook = JSON.parse(body).events[0];
        console.log(webhook);
        const line = require('@line/bot-sdk');
        const client = new line.Client({
          channelAccessToken: '70OvC3/iu54xqueqo8SvlkYlN688iEcIebYeFaauuMPkmmX4nX7+IE91yqXkEoxRdLOwhniwKbP1YoTPAjeJjKdJukl+vXwOQ9pG5EFTmtrrjao02Cj58efQxkOVdTCWaa8y/bfVLbn5djFZSrbdigdB04t89/1O/w1cDnyilFU='
        });

        client.getProfile(webhook.source.userId)
          .then((profile) => {
                console.log(profile.displayName);
                console.log(profile.userId);
                console.log(profile.pictureUrl);
                console.log(profile.statusMessage);
            var sender = profile.displayName;
            var message = createMessage(message,sender,webhook);
            googlehomeSpeak(message);
          })
          .catch((err) => {
            var message = "誰かからLINEです";
            googlehomeSpeak(message);
        });
    });
});
server.listen(port, ipadress);
console.log("server listening ...");

// create statusMessage
function createMessage(message,sender,webhook){
  message = sender + "さんからLINEです。";
  if (webhook.type == 'message' && webhook.message.type == 'text') {
     message += webhook.message.text;
  }
  return message;
}

// googlehome speak
function googlehomeSpeak(message) {
  const googlehome = require('google-home-notifier')
  const language = 'ja';
  googlehome.device('Google-Home', language);
  googlehome.notify(message, function(res) {
    console.log(res);
  });
}

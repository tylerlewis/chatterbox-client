// YOUR CODE HERE:
// https://api.parse.com/1/classes/appterbox

var app = {};

app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({ username: app.userName, text: message, roomname: 'wwwwwww' })
  }).done(function(msg) { console.log(msg); });
};

app.fetch = function(firstDownload) {
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox?order=-createdAt",
    type: "GET"
  }).done(function(msgs) {
    //Sends the last message object to displayMessages
    var results = msgs.results;
    if(firstDownload) {
      var count = 0;
      var idx = 0;

      while(count < 20) {
        if(app.displayMessages(results[idx], 'firstRun')) {
          count++;
          idx++;
        } else {
          idx++;
        }
      }
    } else {
      app.displayMessages(results[0]);
    }
  });
};

app.validMessage = function(message) {
  // Checks to see if the message exists or if there is a script tag
  var username = message.username;
  var message = message.text;

  if( !message
    || username.length > 50
    || username.toLowerCase().indexOf('<script') !== -1
    || username.toLowerCase().indexOf('style=') !== -1
    || username.toLowerCase().indexOf('<img') !== -1
    || message.length > 150
    || message.toLowerCase().indexOf('<script') !== -1
    || message.toLowerCase().indexOf('style=') !== -1
    || message.toLowerCase().indexOf('<img') !== -1 ) {
    return false;
  } else {
    return true;
  }
};

app.displayMessages = function(currentMessage, firstRun) {
  var username = currentMessage.username;
  var message = currentMessage.text;
  var roomname = currentMessage.roomname;
  var createdAt = currentMessage.createdAt;
  var messageObjId = currentMessage.objectId;
  $messages = $('#messages');

  if(messageObjId !== app.lastMsg) {
    if(app.validMessage(currentMessage)) {
      if(firstRun){
        $messages.append('<li>[' + createdAt + '] ' + username + ': ' + message + '</li>');
      } else {
        $messages.prepend('<li>[' + createdAt + '] ' + username + ': ' + message + '</li>');
      }
      if($('#messages > li').length >= 20) {
        $('#messages > li').remove('li:gt(19)');
      }
      app.lastMsg = messageObjId;
      return message;
    } else {
      return false;
    }
  }
};

app.init = function() {
  app.lastMsg;
  app.userName = 'Guest';

  app.fetch(true);
  setInterval( app.fetch , 2000 );

  var $chatMessage = $('#chatMessage');
  var $userName = $('#userName');

  $chatMessage.on('keyup', function(e) {
    if(e.which === 13 && $chatMessage.val().trim()) {
      app.send($chatMessage.val().trim());
      $chatMessage.val('');
    }
  });

  $userName.on('keyup', function(e) {
    app.userName = $userName.val();
  });
};

$(document).ready(function(){
  app.init();
});

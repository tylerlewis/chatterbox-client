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

app.fetch = function(firstDownload, className) {
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox?order=-createdAt",
    type: "GET"
  }).done(function(msgs) {
    //Sends the last message object to displayMessages
    var results = msgs.results;
    if(firstDownload) {
      var count = 0;
      var idx = 0;
      console.log(className);
      while(count < 20) {
        if(className) {
          if(results[idx].roomname === className) {
            if(app.displayMessages(results[idx], 'firstRun')) {
              count++;
              idx++;
            } else {
              idx++;
            }
          } else {
            idx++;
          }
        } else {
          if(app.displayMessages(results[idx], 'firstRun')) {
            count++;
            idx++;
          } else {
            idx++;
          }
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
  var roomname = currentMessage.roomname || 'onlyOnHome';
  var createdAt = currentMessage.createdAt;
  var messageObjId = currentMessage.objectId;
  var time = new Date();
  var timeStamp = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
  $messages = $('#messages');

  if(app.friends[username]) {
    roomname = roomname + ' f      riend';
  }

  if(messageObjId !== app.lastMsg) {
    if(app.validMessage(currentMessage)) {
      if(firstRun){
        $messages.append('<li class="'+ roomname +'"><b><span style="color:#727C2A" >' + timeStamp + '</span> <span class="user">' + username + '</span></b>: ' + message + '</li>');
      } else {
        $messages.prepend('<li class="'+ roomname +'"><b><span style="color:#727C2A">' + timeStamp + '</span> <span class="user">' + username + '</span></b>: ' + message + '</li>');
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
  app.friends = {};

  app.fetch(true);
  app.standardUpdate = setInterval( app.fetch , 2000 );
  // app.standardUpdate();

  var $chatMessage = $('#chatMessage');
  var $userName = $('#userName');
  var $roomName = $('#roomName');

  $chatMessage.on('keyup', function(e) {
    if(e.which === 13 && $chatMessage.val().trim()) {
      app.send($chatMessage.val().trim());
      $chatMessage.val('');
    }
  });

  $userName.on('keyup', function(e) {
    app.userName = $userName.val();
  });

  $roomName.on('keyup', function(e) {
    if(e.which === 13 && $roomName.val().trim()) {
      $('#messages li').remove();
      console.log($roomName.val().trim());
      clearInterval(app.standardUpdate);
      clearInterval(app.roomUpdate);
      app.fetch(true, $roomName.val().trim());
      app.roomUpdate = setInterval(function() { app.fetch(false, $roomName.val().trim()); }, 2000 );
    }
  });

  $('#friendBtn').on('click', function() {
    if($('#friendBar').css('display') === 'none') {
      $('#friendBar').slideDown('slow');
    } else {
      $('#friendBar').slideUp('slow');
    }
    console.log('clicked');
  });

  $('#messages').on('click', '.user', function() {
    var friendName = $(this).context.innerHTML;
    app.friends[friendName] = friendName;
    $('#messages li:contains("' + friendName + '")').addClass('friend');

    console.log(friendName);
  });
};

$(document).ready(function(){
  app.init();
});

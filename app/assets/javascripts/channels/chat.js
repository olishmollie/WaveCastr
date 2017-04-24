function subscribeToChat() {
  var chatContainer = document.getElementById('chat-container');
  App.chat = App.cable.subscriptions.create({channel: "ChatChannel", lobby: lobby}, {
    connected: function() {
    },

    received: function(data) {
      this.post(data);
    },

    post: function(data) {
      this.addMessageToChat(data.message);
    },

    addMessageToChat: function(message) {
      chatContainer.innerHTML = chatContainer.innerHTML + '<br>' + message;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    clearChatBox: function() {
      chatContainer.innerHTML = '';
    }
  });

  var $chatInput = $('#chat-input');
  var $chatSend = $('#chat-send')

  $chatSend.on('click', function() {
    var guest = $('#current_guest').text();
    if ($chatInput.val().length === 0) { return }

    App.chat.perform('chat', { guest: guest, message: $chatInput.val() });
    $chatInput.val('');
  });

  $chatInput.on('keyup', function(e) {
    if (e.keyCode === 13) {
      $chatSend.trigger('click');
    }
  });
}

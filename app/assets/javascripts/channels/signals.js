function subscribeToSignals() {
  App.signals = App.cable.subscriptions.create({channel: "SignalsChannel", lobby: lobby}, {
    connected: function() {
      // Called when the subscription is ready for use on the server
    },

    disconnected: function() {
      // Called when the subscription has been terminated by the server
    },

    received: function(data) {
      switch (data.type) {
        case 'offer':
          if (isHost()) { return; }
          hostId = data.host_id; 
          hostSDP = data.sdp;
          document.dispatchEvent(receiveOffer);
          break;
        case 'answer':
          guestSDP = data.sdp;
          document.dispatchEvent(receiveAnswer);
      }
    }
  });
}

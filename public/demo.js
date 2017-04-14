var demo_messages = [
  "Welcome to WaveCastr!",
  "You can add additional users by simply copying the url (we've made it easy with the 'Share Link' button) into an incognito window or another browser and enter your name.",
  "Once you're ready, activate everyone's mics with the button below and select yes when your browser asks for permission to access your microphone",
  "Congrats, your mic is armed and ready to go! Once everyone's permissions have been granted, your guests' icons will turn green.",
  "Press record, and both browsers will a record separate audio track for each guest. Push stop and those tracks will be automatically uploaded to our AWS server.",
  "Nice! You've recorded your first podcast with WaveCastr! Once the tracks are ready, you should see links to download them below, and your editor can now get started on post-production.",
  "Thanks for trying WaveCastr!"
]

function addDemoMessageToChat(message) {
  App.chat.clearChatBox();
  App.chat.addMessageToChat(message.replace(/\n/g, "<br>"));
}
// First demo
window.onload = function() {
  addDemoMessageToChat(demo_messages.slice(0, 3).join("\n\n") + "\n");
}
// Second demo
addDemoMessageToChat(demo_messages.slice(3, 5).join("\n\n"));
// Last demo
addDemoMessageToChat(demo_messages.slice(5).join("\n\n"));



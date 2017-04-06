var recorder;

window.onload = function() {
  App.chat.addMessageToChat(demo_messages[0]);
  App.chat.addMessageToChat(demo_messages[1]);
  App.chat.addMessageToChat(demo_messages[2]);
}

start.addEventListener( "click", function(){
  App.recorder.perform("receive", {command: 'start'});
});
stopButton.addEventListener( "click", function(){
  App.recorder.perform("receive", {command: 'stop'});
});
init.addEventListener( "click", function(){
  App.recorder.perform("receive", {command: 'init'});
});

var startEvent = new Event('startRecording');
var stopEvent = new Event('stopRecording');
var initEvent = new Event('initRecording');

document.addEventListener('startRecording', function(e) {
  recorder.start();
});
document.addEventListener('stopRecording', function(e) {
  recorder.stop();
  App.chat.addMessageToChat(demo_messages[4]);;
});
document.addEventListener('initRecording', function(e) {
  initRecording();
});


function initRecording() {

  if (!Recorder.isRecordingSupported()) {
    App.appearance.perform("update", {status: 'error'});
    $('#flash').flash("Sorry, recording features are not supported in your browser.", { class: 'alert' });
    return;
  }

  recorder = new Recorder({
    // Settings like bitrate or sampleRate would go here
    encoderPath: "/recorderjs/encoderWorker.min.js" });

  recorder.addEventListener( "start", function(e){
    App.chat.addMessageToChat('SYSTEM: <i>Recorder has started</i>');
    init.disabled = start.disabled = true;
    stopButton.disabled = false;
  });

  recorder.addEventListener( "stop", function(e){
    App.chat.addMessageToChat('SYSTEM: <i>Recorder has stopped</i>');
    init.disabled = false;
    stopButton.disabled = start.disabled = true;
  });

  recorder.addEventListener( "streamError", function(e){
    $('#flash').flash('Error encountered: ' + e.error.name, {class: 'alert'});
  });

  recorder.addEventListener( "streamReady", function(e){
    stopButton.disabled = true;
    start.disabled = false;
    App.appearance.perform("update", {status: 'ready'});
    App.chat.addMessageToChat('SYSTEM: <i>Audio stream ready</i>');
    App.chat.addMessageToChat(demo_messages[3]);
  });

  recorder.addEventListener( "dataAvailable", function(e){
    var dataBlob = new Blob( [e.detail], { type: 'audio/ogg' } );
    dataBlob.name = "__" + $('#current_user').text() + '__' + new Date().toISOString() + ".ogg";
    var fileName = dataBlob.name;
    var url = URL.createObjectURL( dataBlob );

    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.innerHTML = link.download;

    var div = document.createElement('div');
    $(div).addClass('track panel panel-default');
    div.appendChild(link);

    $('#episode_track').fileupload({
      url: $('.directUpload').data('url'),
      type:            'POST',
      autoUpload:       true,
      formData: $('.directUpload').data('form-data'),
      paramName: 'file',
      dataType: 'XML',
      replaceFileInput: false
    });

    $('#episode_track').fileupload('send', {
      files: [dataBlob]
    })
    .done(function(response){
      var episodeSharableLink = window.location.pathname.replace(/\/episodes\//, '');
      var xmlSerializer = new XMLSerializer();
      var s3String = xmlSerializer.serializeToString(response);
      var newTrackData = { sharable_link: episodeSharableLink, track: { s3_string: s3String } };

      $.ajax({
        url: "/tracks",
        method: "POST",
        data: newTrackData
      })
      .done(function(response){
        $('#flash').flash("Your recording was successfully saved.", { fadeOut: 2000 });
      })
      .fail(function(response){
        $('#flash').flash('Sorry, something went wrong. A local version of your recording is available under the control panel.', { class: 'alert' });
        localRecording.appendChild(div);
      })
    }).fail(function(response) {
      $('#flash').flash('Sorry, something went wrong. Please try again.', { class: 'alert' });
    });
  });
  recorder.initStream();
}


var demo_messages = [
  "Welcome to WaveCastr!",
  "You can add additional users by simply copying the url (we've made it easy with the 'Share Link' button) into an incognito window or another browser and enter your name.",
  "Once you're ready, activate everyone's mics with the button below and select yes when your browser asks for permission to access your microphone",
  "Congrats, your mic is armed and ready to go! Once everyone's permissions have been granted, your guests' icons will turn green. Press record, and both browsers will a record separate audio track for each guest. Push stop and those tracks will be automatically uploaded to our AWS server.",
  "Nice! You've recorded your first podcast with WaveCastr! Once the tracks are ready, you should see links to download them below. Your editor can now download them and get started on post-production. Thanks for trying WaveCastr!"
]



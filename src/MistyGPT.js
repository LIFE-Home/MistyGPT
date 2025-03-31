misty.Set("dialogue", false);

function startListening() {
    misty.Debug("The value of dialogue is: " + misty.Get("dialogue"));

    misty.RegisterEvent("KeyPhraseRecognized","KeyPhraseRecognized", 10, false);

    misty.StartKeyPhraseRecognition();

    misty.Debug("Started listening for key phrase");
}

function _KeyPhraseRecognized() {
    misty.AddReturnProperty("VoiceRecord", "Filename");
    misty.AddReturnProperty("VoiceRecord", "Success");
    misty.AddReturnProperty("VoiceRecord", "ErrorCode");
    misty.AddReturnProperty("VoiceRecord", "ErrorMessage");
    misty.RegisterEvent("VoiceRecord", "VoiceRecord", 10, false);

    misty.Debug("Started recording data");
}

function _VoiceRecord(data) {
    var audioFileName = data.AdditionalResults[0];
    var success = data.AdditionalResults[1];
    var errorCode = data.AdditionalResults[2];
    var errorMessage = data.AdditionalResults[3];

    if (success) {
        misty.Debug("Successfully captured speech to " + audioFileName);
        misty.GetAudioFile(audioFileName, "sendAudio");
    } 
    else {
       misty.Debug("Error: " + errorCode + ". " + errorMessage);
    }
}

function sendAudio(data) {
    var audio = data.Result.Base64;

    var url = "https://misty-gpt-zeta.vercel.app/generate-response";
    misty.SendExternalRequest("POST", url, null, null, JSON.stringify({"audio": audio}), false, false, null, "application/json");
}

function _SendExternalRequest(data) {
    var response = JSON.parse(data.Result.ResponseObject.Data);
    if ("dialogue" in response) {
        misty.Set("dialogue", !misty.Get("dialogue"));

        misty.AddReturnProperty("VoiceRecord", "Filename");
        misty.AddReturnProperty("VoiceRecord", "Success");
        misty.AddReturnProperty("VoiceRecord", "ErrorCode");
        misty.AddReturnProperty("VoiceRecord", "ErrorMessage");
        misty.RegisterEvent("VoiceRecord", "VoiceRecord", 10, false);
        
        misty.CaptureSpeech(false, true, 7500, 5000);
    }
    else if ("message" in response) {
        misty.RegisterEvent("TextToSpeechComplete", "TextToSpeechComplete", 10, false);
        misty.Speak(response.message, true, "Message");
    }
    else {
        misty.RegisterEvent("TextToSpeechComplete", "TextToSpeechComplete", 10, false);
        misty.Speak("Sorry, I didn't get that. Can you say that again?", true, "Error");
    }
}

function _TextToSpeechComplete(data) {
    if (misty.Get("dialogue")) {
        misty.AddReturnProperty("VoiceRecord", "Filename");
        misty.AddReturnProperty("VoiceRecord", "Success");
        misty.AddReturnProperty("VoiceRecord", "ErrorCode");
        misty.AddReturnProperty("VoiceRecord", "ErrorMessage");
        misty.RegisterEvent("VoiceRecord", "VoiceRecord", 10, false);
        
        misty.CaptureSpeech(false, true, 7500, 5000);
    }
    else {
        startListening();
    }
}

startListening();
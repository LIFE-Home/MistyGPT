misty.Set("position", "(0, 0)");
misty.Set("bearing", 0);

function startListening() {
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
    misty.SendExternalRequest("POST", url, null, null, JSON.stringify({"audio": audio, "position": misty.Get("position"), "bearing": misty.Get("bearing")}), false, false, null, "application/json");
}

function _SendExternalRequest(data) {
    var response = JSON.parse(data.Result.ResponseObject.Data);

    if (response["move"]) {
        misty.Set("position", response["position"]);
        misty.Set("bearing", response["bearing"]);
        
        misty.DriveArc((360-response["bearing"])%360, 0, 3000, false);
        misty.Pause(5000);
        misty.DriveHeading((360-response["bearing"])%360, response["distance"], 3000, false);
    }

    else if ("message" in response) {
        misty.Speak(response.message, true);
    }
    
    else {
        misty.Speak("Sorry, I didn't get that. Can you say that again?", true);
    }

    startListening();
}

startListening();
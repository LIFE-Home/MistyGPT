misty.Set("position", "[0, 0]");
misty.Set("bearing", 0);

function startListening() {
    misty.RegisterEvent("KeyPhraseRecognized","KeyPhraseRecognized", 10, false);

    misty.AddReturnProperty("BumpSensor", "Pose");
    misty.AddReturnProperty("BumpSensor", "IsContacted");
    misty.RegisterEvent("BumpSensor", "BumpSensor", 10, false);

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

function _BumpSensor(data) {
    let frameId = data.AdditionalResults[0].FrameId;
    let success = data.AdditionalResults[1];

    if (success && frameId == "RobotBaseCenter") {
        misty.Debug("Returning to bearing 0");
        misty.DriveArc(0, 0, 3000, false);
        misty.Set("bearing", 0);
    }

    startListening();
}

function _VoiceRecord(data) {
    let audioFileName = data.AdditionalResults[0];
    let success = data.AdditionalResults[1];
    let errorCode = data.AdditionalResults[2];
    let errorMessage = data.AdditionalResults[3];

    if (success) {
        misty.Debug("Successfully captured speech to " + audioFileName);
        misty.GetAudioFile(audioFileName, "sendAudio");
    } 
    else {
       misty.Debug("Error: " + errorCode + ". " + errorMessage);
    }
}

function sendAudio(data) {
    let audio = data.Result.Base64;

    let url = "https://misty-gpt-zeta.vercel.app/move-robot";
    misty.SendExternalRequest("POST", url, null, null, JSON.stringify({"audio": audio, "position": misty.Get("position"), "bearing": misty.Get("bearing")}), false, false, null, "application/json");
}

function _SendExternalRequest(data) {
    let response = JSON.parse(data.Result.ResponseObject.Data);
    
    if ("message" in response) {
        misty.Speak(response.message, true);
    }
    else if ("location" in response) {
        misty.Set("position", response["position"]);
        misty.Set("bearing", response["bearing"]);
        
        misty.Speak("I'm on my way to the " + response["location"]);
        misty.DriveArc(360-response["bearing"], 0, 3000, false);
        misty.Pause(7000); 
        misty.DriveHeading(360-response["bearing"], response["distance"], 3000, false);
        if (response["distance"] != 0) {
            misty.Pause(5000);
        }
        misty.Speak("I've reached the " + response["location"]);
    }   
    else {
        misty.Speak("Sorry, I didn't get that. Can you say that again?", true);
    }

    startListening();
}

startListening();
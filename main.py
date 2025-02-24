from mistyPy.Robot import Robot
from mistyPy.Events import Events
import openai

import speech_recognition as sr 

import time
import dotenv
import base64
import io
import os
import random as rd
import json

dotenv.load_dotenv()
IP_ADDRESS = os.getenv("IP_ADDRESS")

misty = Robot(IP_ADDRESS)
rec = sr.Recognizer()
misty.SetDefaultVolume(50)

openai_client = openai.OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

def speech_captured(data):
    print("Voice recorded")
    print(data)
    response = misty.GetAudioFile(data["message"]["filename"], base64 = True)
    
    file = io.BytesIO(base64.b64decode(response.json()["result"]["base64"]))

    with sr.AudioFile(file) as audio:
        data = rec.record(audio)

    try:
        msg = rec.recognize_google(data)
        process_user_input(msg.lower())
    except Exception as e:
        print(e)
    
    misty.StartKeyPhraseRecognition(overwriteExisting = True)


def process_user_input(user_input: str):
    print(user_input)
    moveArms = "arms"
    moveHead = "head"
    moveForward = "forward"
    moveBackward = "backward"
    lowerVolume = "lower my volume"
    higherVolume = "higher my volume"
    changeDisplay = "change my display"
    guides: dict = json.load(open("guides.json"))["guides"]

    if moveArms in user_input:
        misty.MoveArms(-50, -50, 40, 40)
        time.sleep(2)
        misty.MoveArms(50, 50, 40, 40)

    elif moveHead in user_input:
        misty.MoveHead(0, -25, 0, 100, None, None)
        time.sleep(2)
        misty.MoveHead(0, 25, 0, 100, None, None)
        time.sleep(2)
        misty.MoveHead(0, 0, 0, 100, None, None)

    elif moveForward in user_input:
        misty.DriveTime(50, 0, 2000, 0)

    elif moveBackward in user_input:
        misty.DriveTime(-50, 0, 2000, 0)

    elif lowerVolume in user_input:
        misty.SetDefaultVolume(50)

    elif higherVolume in user_input:
        misty.SetDefaultVolume(100)

    elif changeDisplay in user_input:
        imgs = [x["name"] for x in misty.GetImageList().json()["result"]]
        for i in range(3):
            img = rd.choice(imgs)
            misty.DisplayImage(img)
            time.sleep(3)

        misty.DisplayImage("e_defaultcontent.jpg")

    elif user_input.startswith("echo"):
        misty.MoveArms(-70, 50, 40, 40)
        misty.Speak(user_input[3:])
        misty.MoveArms(50, 50, 40, 40)

    else:
        misty.MoveArms(-70, 50, 40, 40)

        context = "You are the Misty 2 Robot and your primary purpose is to support as a socially assistive robot for people of all ages and abilities. Using this context, "

        found = False
        for key in guides.keys():
            if key in user_input:
                message = guides[key].format(user_input = user_input)
                found = True

        if not found:
            message = user_input

        messages = [
            {
                "role": "user",
                "content": f"You are the Misty 2 Robot and your primary purpose is to support as a socially assistive robot for people of all ages and abilities. Using this context, provide a response {'' if found else 'to'} '{message}'. You do not have to introduce yourself. If you do not understand the provided question, reply with 'Sorry, I didn't get that. Can you say that again?'. Unless the question is objective without requiring much elaboration, make your response at most 5 sentences long, but do not go below 3 sentences."
            }
        ]

        response = openai_client.chat.completions.create(
            model = "gpt-4o-mini",
            messages = messages
        )

        mistyOutput = response.choices[0].message.content

        print(mistyOutput)
        misty.Speak(mistyOutput)
        misty.MoveArms(50, 50, 40, 40)

def recognized(data):
    print("Face detected")
    misty.Speak("Yay, Hi " + data["message"]["label"], 1)
    misty.StopFaceRecognition()
    time.sleep(2)
    misty.Speak("How can I help you today", utteranceId="required-for-callback")

def touch_sensor(data):
    print("Sensor touched")
    if data["message"]["sensorId"] == "cap" and data["message"]["isContacted"] == True:
        touched_sensor = data["message"]["sensorPosition"]

        if touched_sensor == "Scruff":
            misty.PlayAudio("s_Rage.wav")
            misty.DisplayImage("e_Anger.jpg")
            time.sleep(3)

        if touched_sensor == "HeadFront": 
            misty.MoveHead( -5, 0, 0, 85, None, None)
            misty.DisplayImage("e_Joy2.jpg")
            misty.Speak("Aha")
            time.sleep(1)
            misty.StartFaceRecognition()

        if touched_sensor == "Chin":
            misty.MoveHead(0, -50, 0, 150, None, None)
            misty.PlayAudio("s_Love.wav")
            misty.DisplayImage("e_Love.jpg")
            time.sleep(2)
            misty.DisplayImage("e_DefaultContent.jpg")
            misty.UnregisterEvent("arbitrary-name")

misty.RegisterEvent(event_name="touch-sensor",
                     event_type=Events.TouchSensor,
                     callback_function=touch_sensor,
                     keep_alive=True)


misty.RegisterEvent(event_name="detect-voice",
                     event_type=Events.VoiceRecord,
                     callback_function=speech_captured,
                     keep_alive=True)

misty.RegisterEvent(event_name="face-recognition-event", 
                     event_type=Events.FaceRecognition, 
                     callback_function=recognized, 
                     keep_alive=False)

misty.RegisterEvent(event_name="key-phrase",
                    event_type=Events.KeyPhraseRecognized,
                    callback_function=lambda: misty.CaptureSpeech(overwriteExisting = True),
                    keep_alive=True)

misty.StartKeyPhraseRecognition(overwriteExisting = True)

print("Bot is active")
misty.KeepAlive()
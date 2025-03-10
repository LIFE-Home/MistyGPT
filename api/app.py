from flask import Flask, request
import openai

import speech_recognition as sr
import io
import os
import json
import base64

app = Flask(__name__)

@app.route("/")
def index():
    return '<marquee direction="right"><h1>The MistyGPT API is up and running!</h1></marquee>'

def answer_prompt(prompt):
    openai_client = openai.OpenAI(
        api_key = os.getenv("OPENAI_API_KEY")
    )

    guides: dict = json.load(open("./api/guides.json"))["guides"]

    found = False
    for key in guides.keys():
        if key in prompt:
            message = guides[key].format(prompt = prompt)
            found = True

    if not found:
        messages = [
            {
                "role": "user",
                "content": f"You are the Misty 2 Robot and your primary purpose is to support as a socially assistive robot for people of all ages and abilities. Using this context, provide a response to '{prompt}'. You do not have to introduce yourself. If you do not understand the provided question, reply with 'Sorry, I didn't get that. Can you say that again?'. Unless the question is objective without requiring much elaboration, make your response at most 5 sentences long, but do not go below 3 sentences."
            }
        ]
        print("Unguided response")
    
    else:
            messages = [
                {
                    "role": "user",
                    "content": message
                }
            ]
            print("Guided response")

    response = openai_client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = messages
    )

    return response.choices[0].message.content

@app.route("/generate-response", methods = ["POST"])
def generate_response():
    rec = sr.Recognizer()

    audio = request.get_json()
    
    file = io.BytesIO(base64.b64decode(audio["audio"]))

    with sr.AudioFile(file) as audio:
        data = rec.record(audio)

    try:
        msg = rec.recognize_google(data).lower()
        print("Input:", msg)
        output = answer_prompt(msg)
        print("Output:", output)
    except Exception as e:
        print("Error:", e)
        return {"error": str(e.with_traceback(e.__traceback__))}

    return {"message": output}

if __name__ == "__main__":
    app.run(debug = True)
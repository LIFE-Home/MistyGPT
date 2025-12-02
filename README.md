# MistyGPT

## Information regarding MistyGPT

### Repository structure

```
│   .gitignore
│   README.md
│   requirements.txt
│   vercel.json
│
├───api
│       app.py
│       grid.json
│       guides.json
│
└───src
    ├───MistyGPT
    │       MistyGPT.js
    │       MistyGPT.json
    │
    └───MistyMoov
            MistyMoov.js
            MistyMoov.json
```

### Important components

- `api/app.py`: Main file for running the API

- `api/grid.json`: Editable file to modify locations for navigation

- `api/guides.json`: Editable file to customize prompt to the GPT

- `src/MistyGPT/MistyGPT.js`: JavaScript wrapper for controlling the interactions between the robot and the API for the MistyGPT skill

- `src/MistyGPT/MistyGPT.json`: Metadata for the MistyGPT skill

- `src/MistyMoov/MistyMoov.js`: JavaScript wrapper for controlling the interactions between the robot and the API for the MistyMoov skill

- `src/MistyMoov/MistyMoov.json`: Metadata for the MistyMoov skill

- `requirements.txt`: List of Python dependencies for the API

### Hosting notes

- The API is currently hosted on [Vercel](https://vercel.com/life-homes-projects/misty-gpt)

- The original repository is located [here](https://github.com/lifehome-illinois/MistyGPT), and the fork used for hosting is located [here](https://github.com/LIFE-Home/MistyGPT)

- The API URL for sending requests is located [here](https://misty-gpt-zeta.vercel.app)

- A GitHub workflow has been set up to automatically sync new changes from the original repository to the hosting fork. However, if something does not seem to be working as expected, make sure that the changes are reflected in the hosting fork, especially for changes made to the API. If the changes are not visible, simply update the fork manually

### Using the skill

- To run the skill, visit the **Programming > Skill Management** section of the Misty dashboard and select the **Start** option for **MistyGPT**

- **Optional**: Although MistyMoov is packaged within MistyGPT, it can also be run independently with its standalone skill using the same method as outlined above

- Prefix your verbal query with **Hey, Misty**, wait till you hear a chime and a glowing blue LED from its helmet, and then ask your query

- When using MistyMoov within MistyGPT, use the keyword **go** to switch to navigation mode and make the robot move to the specified location. This keyword is not required if MistyMoov is used independently

- Press the front sensors to make Misty turn back to bearing 0 as specified by its internal IMU

### Modifying the skill

- To guide communication in a particular direction, you can edit the `api/guides.json` file

- The code takes the user input and searches for the presence of a guide phrase at any point in the query. If detected, the default prompt is switched to the prompt associated with the corresponding guide phrase as outlined in the JSON file

- When adding a new guide phrase, add a new key-value pair to the JSON file, where the key is the guide phrase to be detected, and the value is the associated prompt. If you wish to substitute the user input at any point in the prompt, use `{prompt}` in the appropriate location

- To modify the locations used in voice-controlled navigation, you can edit the `api/grid.json` file. **Note**: All dimensions are in metres

- The code switches to navigation mode when it hears the **go** keyword, and searches the JSON file for the presence of a key or alias in the user input. If detected, it will use its current position and destination to automatically calculate the distance and direction in which it should travel

- The MistyMoov skill works exactly as outlined above, except that it does not depend on the existence of the **go** keyword, since navigation is its sole purpose, which also implies that it will not respond to any other prompts

- Commit the code and push it to GitHub, and then sync the code in the hosting fork to reflect the change in the skill

### Testing the skill locally

- To test the skill locally, first clone the repository with:

```console
git clone https://github.com/lifehome-illinois/MistyGPT.git
```

- Navigate into the cloned repository and create a virtual environment with the following commands:

    - Windows:
    ```console
    python -m venv .venv
    .venv\Scripts\activate
    ```

    - Mac/Linux:
    ```console
    python3 -m venv .venv
    . .venv/bin/activate
    ```

- Install the required dependencies using the following commands:

```console
pip install -r requirements.txt
pip install python-dotenv
```

- Create a `.env` file in the `api` folder with the following format:

```console
OPENAI_API_KEY = <your OPENAI API key>
```

- Uncomment lines 11-13 in `api/app.py` before running the API locally

- **Note**: In order to allow Misty to access the API running on `localhost`, you will have to use some sort of an API gateway like [ngrok](https://ngrok.com/) and change the `url` variables in the `src/MistyGPT/MistyGPT.js` and `src/MistyMoov/MistyMoov.js` files appropriately

### Contributors

- Srivishnu Vusirikala ([@vsmart-06](https://github.com/vsmart-06))
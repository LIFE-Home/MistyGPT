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

- `api/app.py`: Main file for running the API (hosted on Vercel)

- `api/guides.json`: Editable file to customize prompt to the GPT

- `api/grid.json`: Editable file to modify locations for navigation

- `src/MistyGPT/MistyGPT.js`: JavaScript wrapper for controlling the interactions between the robot and the API for the MistyGPT skill

- `src/MistyGPT/MistyGPT.json`: Metadata for the MistyGPT skill

- `src/MistyMoov/MistyMoov.js`: JavaScript wrapper for controlling the interactions between the robot and the API for the MistyMoov skill

- `src/MistyMoov/MistyMoov.json`: Metadata for the MistyMoov skill

- `requirements.txt`: List of Python dependencies for the API

### Hosting notes

- The API is currently hosted on [Vercel](https://vercel.com/life-homes-projects/misty-gpt)

- The repository used for the hosting is a fork of this repository and is located [here](https://github.com/LIFE-Home/MistyGPT)

- The API URL for sending requests is located [here](https://misty-gpt-zeta.vercel.app)

- Whenever a change is made to this repository, especially if a change is made to the API, the hosting fork must be synced to the repository for the changes to be reflected

### Using the skill

- To run the skill, visit the **Programming > Skill Management** section of the Misty dashboard and select the **Start** option for **MistyGPT**

- **Optional**: Although MistyMoov is packaged within MistyGPT, it can also be run independently using its standalone skill using the same method as outlined above

- Prefix your query with **Hey, Misty**, wait till you hear a chime and a glowing blue LED from its helmet, and then ask your query

### Modifying the skill

- To guide communication in a particular direction, you can edit the `api/guides.json` file

- The code takes the user input and searches for the presence of a guide phrase at any point in the query. If detected, the default prompt is switched to the prompt associated with the corresponding guide phrase as outlined in the JSON file

- When adding a new guide phrase, add a new key-value pair to the JSON file, where the key is the guide phrase to be detected, and the value is the associated prompt. If you wish to substitute the user input at any point in the prompt, use `{prompt}` in the appropriate location

- To modify the locations used in voice-controlled navigation, you can edit the `api/grid.json` file

- The code switches to navigation mode when it hears the **go** keyword, and searches the JSON file for the presence of a key or alias in the user input. If detected, it will use its current position and destination to automatically calculate the distance and direction in which it should travel

- The MistyMoov skills works exactly as outlined above, except that it does not depend on the existence of the **go** keyword, since navigation is its sole purpose

- Commit the code and push it to GitHub, and then sync the code in the hosting fork to reflect the change in the skill

### Contributors

- Srivishnu Vusirikala ([@vsmart-06](https://github.com/vsmart-06))
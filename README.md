# MistyGPT

## Instructions to run MistyGPT on a Misty Robot locally

1. Switch on the Misty Robot

2. Step 2: Create a `.env` file with the following format:

```console
OPENAI_API_KEY = <your openai key>
IP_ADDRESS = <your misty ip address>
```

3. Create a virtual environment and activate it with the following commands:

    - Windows:
    ```console
    python -m venv .venv
    .venv\Scripts\activate
    ```

    - MacOS/Linux
    ```console
    python3 -m venv .venv
    . .venv/bin/activate
    ```

4. Install the required dependencies with the following command:

```console
pip install -r requirements.txt
```

5. Run the script in the terminal with the following command:

    - Windows:
    ```console
    python main.py
    ```

    - MacOS/Linux
    ```console
    python3 main.py
    ```
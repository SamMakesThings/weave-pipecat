FROM dailyco/pipecat-base:latest

COPY ./requirements.txt requirements.txt

COPY ./assets assets

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./bot-openai.py bot.py

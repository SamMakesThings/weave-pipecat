FROM dailyco/pipecat-base:latest

COPY ./requirements.txt requirements.txt

COPY ./assets assets

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the levels directory
COPY ./levels ./levels

COPY ./bot-openai.py bot.py

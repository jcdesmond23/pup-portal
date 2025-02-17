FROM python:3.9-slim  

WORKDIR /app  

COPY backend/requirements.txt . 

RUN pip install --no-cache-dir --upgrade -r requirements.txt  

COPY backend/ .  

CMD ["fastapi", "run", "main.py", "--port", "80"]
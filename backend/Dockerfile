FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libfontconfig1 \
    libfreetype6 \
    libharfbuzz0b \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entry-point.sh /app/wait-for-it.sh

EXPOSE 5000

ENTRYPOINT ["/app/entry-point.sh"]

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
#!/bin/bash
./wait-for-it.sh db:5432 -t 0 -- flask db init
./wait-for-it.sh db:5432 -t 0 -- flask db migrate
./wait-for-it.sh db:5432 -t 0 -- flask db upgrade

mkdir -p /app/assets

exec gunicorn -b 0.0.0.0:5000 -w 4 server:app
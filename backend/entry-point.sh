#!/bin/bash
./wait-for-it.sh db:5432 -t 0 -- flask db init
./wait-for-it.sh db:5432 -t 0 -- flask db migrate
./wait-for-it.sh db:5432 -t 0 -- flask db upgrade

mkdir -p /app/assets

exec flask run --host=0.0.0.0 --port=5000
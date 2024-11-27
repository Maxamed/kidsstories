# Kids Stories Backend Flask

### Setup Application:

```
cd backend
```

```
python -m venv venv/
```

```
venv\Scripts\activate
```

```
pip install -r requirements.txt
```

### Run Application:

```
flask --app server run
```

### DB Migration:

```
flask --app server db init
```

```
flask --app server db migrate -m "migration message"
```

```
flask --app server db upgrade
```

```
flask --app server db downgrade
```
dev: install
	NODE_ENV=development node build.mjs&
	cp -r resources/* dist/
	python3 src/main.py

run: install
	poetry run gunicorn src.main:app --workers 1 --bind 127.0.0.1:8000

build: install
	NODE_ENV=production node build.mjs
	cp -r resources/* dist/

install:
	npm install
	poetry install --sync

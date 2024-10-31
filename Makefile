dev: install
	NODE_ENV=development node build.mjs
	cp -r resources/* dist/
	python3 src/main.py

build: install
	NODE_ENV=production node build.mjs
	cp -r resources/* dist/

install:
	npm install

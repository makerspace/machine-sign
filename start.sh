#!/bin/bash

export PATH="$HOME/.local/bin:$PATH"

poetry install --sync
poetry run gunicorn src.main:app --workers 1 --bind 127.0.0.1:5002
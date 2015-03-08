#!/bin/bash

SOURCE=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )
sh "$SOURCE/scripts/generate_html.sh" > "$SOURCE/dist/index.html"
echo "$SOURCE/dist/index.html"

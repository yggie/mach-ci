#!/bin/bash

cat "$1" | sh scripts/generate_html.sh 'index-template.html' > 'index-generated.html'

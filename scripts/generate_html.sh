#!/bin/bash

sed -e\
  "s/<!-- LOGS_PLACEHOLDER -->/$(cat | tr '\n' '||' | sed -e 's:\/:\\\/:g')/g"\
  "${1:-"$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )/dist/index.html.template"}"\
  | tr '||' '\n'

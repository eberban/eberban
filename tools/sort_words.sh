#!/usr/bin/env bash
set -e

# Change directory to the project's root
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."

OUTPUT="$(python3 ./tools/sort_words.py < words.yaml)"
echo "$OUTPUT" > words.yaml

#!/usr/bin/env bash

set -eou pipefail

app=$1

# This script deploys to Heroku.
# Make sure the app has already been created.
git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$app.git origin/master:master

#!/bin/bash

FOLDER=/usr/share/nginx/html
CONFIG_FILE=$FOLDER/env-config.js

# Recreate file
rm -f $CONFIG_FILE
touch $CONFIG_FILE

# Inject runtime env
echo "window.env = {" >> $CONFIG_FILE
echo "  AMSTERDAM_API_KEY: \"${AMSTERDAM_API_KEY}\"" >> $CONFIG_FILE
echo "}" >> $CONFIG_FILE

echo "Runtime environment file created at $CONFIG_FILE"

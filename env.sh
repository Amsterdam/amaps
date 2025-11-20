#!/bin/bash

FOLDER=/var/www/html/env-config
CONFIG_FILE=$FOLDER/env-config.js

# Ensure the folder exists
mkdir -p $FOLDER

# Recreate file
rm -f $CONFIG_FILE
touch $CONFIG_FILE

# Inject runtime env
echo "window.env = {" >> $CONFIG_FILE
echo "  AMSTERDAM_API_KEY: \"${AMSTERDAM_API_KEY}\"" >> $CONFIG_FILE
echo "}" >> $CONFIG_FILE

echo "Runtime environment file created at $CONFIG_FILE"

# Inject into the embedded IIFE bundle in the writable folder
SOURCE="/var/www/html/multiselect.iife.js"   # original build output (read-only)
TARGET="$FOLDER/multiselect.iife.js"                 # writable copy

if [ -f "$SOURCE" ]; then
    echo "Injecting AMSTERDAM_API_KEY into multiselect.iife.js"

    # Copy original file into writable folder
    cp $SOURCE $TARGET

    # Prepend the environment variable
    sed -i "1s|^|window.AMSTERDAM_API_KEY=\"${AMSTERDAM_API_KEY}\";\n|" "$TARGET"
fi

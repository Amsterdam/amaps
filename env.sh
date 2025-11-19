#!/bin/bash

FOLDER=/var/www/html/env-config
CONFIG_FILE=$FOLDER/env-config.js

# Recreate file
rm -f $CONFIG_FILE
touch $CONFIG_FILE

# Inject runtime env
echo "window.env = {" >> $CONFIG_FILE
echo "  AMSTERDAM_API_KEY: \"${AMSTERDAM_API_KEY}\"" >> $CONFIG_FILE
echo "}" >> $CONFIG_FILE

echo "Runtime environment file created at $CONFIG_FILE"

# Inject into the embedded IIFE bundle
EMBED_FILE="/var/www/html/multiselect.iife.js"

if [ -f "$EMBED_FILE" ]; then
    SOURCE="/var/www/html/multiselect.iife.js"
    TARGET="/var/www/html/env-config/multiselect.iife.js"

    # Copy original file into writable directory
    cp $SOURCE $TARGET

    # Inject the key into the writable copy
    sed -i "1s|^|window.AMSTERDAM_API_KEY=\"${AMSTERDAM_API_KEY}\";\n|" "$TARGET"

fi

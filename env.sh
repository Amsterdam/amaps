#!/bin/bash

WWW_DIR=/app/www
CONFIG_FILE=$WWW_DIR/env-config.js

# Recreate env-config.js
rm -f $CONFIG_FILE
touch $CONFIG_FILE

# Inject runtime env
echo "window.env = {" >> $CONFIG_FILE
echo "  AMSTERDAM_API_KEY: \"${AMSTERDAM_API_KEY}\"" >> $CONFIG_FILE
echo "}" >> $CONFIG_FILE

echo "Runtime environment file created at $CONFIG_FILE"

# Inject into the embedded IIFE bundle
EMBED_FILE="$WWW_DIR/multiselect.iife.js"

if [ -f "$EMBED_FILE" ]; then
  echo "Injecting AMSTERDAM_API_KEY into multiselect.iife.js"
  
  # Prepend a line with the runtime env var
  sed -i "1s|^|window.AMSTERDAM_API_KEY=\"${AMSTERDAM_API_KEY}\";\n|" "$EMBED_FILE"
else
  echo "Embedded IIFE not found at $EMBED_FILE, skipping injection"
fi

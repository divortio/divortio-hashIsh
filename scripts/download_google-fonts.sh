#!/bin/bash

# A script to download a Google Fonts CSS file and the fonts it references.
# It then modifies the CSS to use local, relative paths.

# --- Step 1: Handle Command-Line Arguments ---

# Check if exactly two arguments (URL and output directory) are provided.
if [ "$#" -ne 2 ]; then
  echo "❌ Error: Invalid number of arguments."
  echo "This script requires a Google Fonts URL and an output directory."
  echo
  echo "Usage: $0 <google_fonts_url> <output_directory>"
  echo "Example: $0 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' ./public/fonts"
  exit 1
fi

# Assign arguments to variables for better readability.
GOOGLE_FONTS_URL="$1"
OUTPUT_DIR="$2"
CSS_FILE_NAME="google-fonts.css"
CSS_FILE_PATH="$OUTPUT_DIR/$CSS_FILE_NAME"

# --- Step 2: Prepare Output Directory ---

# Create the output directory. The '-p' flag also creates parent directories
# and prevents errors if the directory already exists.
mkdir -p "$OUTPUT_DIR"
echo "📂 Preparing output directory: '$OUTPUT_DIR'"

# --- Step 3: Download Google Fonts CSS File ---

echo "⬇️  Downloading CSS file from Google Fonts..."
# Use wget with a common User-Agent to ensure we get .woff2 font links,
# which are modern and efficient. Google serves different CSS based on the agent.
# The file is saved directly to the specified output directory.
wget -q -O "$CSS_FILE_PATH" --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36" "$GOOGLE_FONTS_URL"

# Check if the CSS download was successful by ensuring the file is not empty.
if [ ! -s "$CSS_FILE_PATH" ]; then
  echo "❌ Error: Failed to download the CSS file. Please check the URL and your internet connection."
  exit 1
fi
echo "👍 CSS file downloaded successfully to '$CSS_FILE_PATH'"

# --- Step 4: Download Font Files ---

# Extract all unique .woff2 URLs from the downloaded CSS file.
URLS=$(grep -o 'https://[^)]*\.woff2' "$CSS_FILE_PATH" | sort -u)

# Proceed only if font URLs were actually found.
if [ -z "$URLS" ]; then
  echo "🤷 No .woff2 font URLs were found in the downloaded CSS file."
else
  echo "⬇️  Downloading fonts (will overwrite existing files)..."
  # Loop through each unique URL to download it.
  echo "$URLS" | while read -r url; do
    # Get just the filename from the full URL.
    filename=$(basename "$url")
    # Download the file and save it to the output directory, overwriting if it exists.
    # The '--show-progress' flag provides a download indicator.
    wget --quiet --show-progress -O "$OUTPUT_DIR/$filename" "$url"
  done
  echo "👍 Font download complete!"
fi

# --- Step 5: Modify CSS File for Relative Paths ---

echo "✍️  Modifying CSS file to use relative font paths..."
# Use a temporary file for the sed operation to safely overwrite the original file.
TEMP_CSS_FILE="$OUTPUT_DIR/temp_fonts.css"
# Use 'sed' to replace the absolute Google URLs with relative './' paths.
# This makes the CSS portable and ready for local hosting.
sed 's|url(https://.*/\([^/)]*\.woff2\))|url(./\1)|g' "$CSS_FILE_PATH" >"$TEMP_CSS_FILE" && mv "$TEMP_CSS_FILE" "$CSS_FILE_PATH"

echo "✅ Success! Your local fonts and CSS are ready in '$OUTPUT_DIR'."

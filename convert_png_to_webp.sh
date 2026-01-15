#!/bin/bash

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install 'webp' package."
    exit 1
fi

# Convert all .png files to .webp
for file in *.png; do
    if [ -f "$file" ]; then
        echo "Converting $file..."
        cwebp -q 80 "$file" -o "${file%.png}.webp"
    else
        echo "No .png files found in the current directory."
        break
    fi
done

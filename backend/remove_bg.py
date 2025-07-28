import sys
import os
from rembg import remove
from PIL import Image

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print("Background removed successfully.")
    except Exception as e:
        print(f"Error removing background: {e}", file=sys.stderr)
        sys.exit(1)

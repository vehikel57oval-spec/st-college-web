import base64
import os
import re

# Configuration
HTML_FILE = 'index.html'
CSS_FILE = 'style.css'
JS_FILE = 'script.js'
ASSETS_DIR = 'assets'
OUTPUT_FILE = 'google_sites_code.html'

def get_base64_image(image_path):
    """Reads an image and returns its base64 data URI."""
    try:
        with open(image_path, "rb") as img_file:
            return "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Warning: Image not found {image_path}")
        return image_path

def bundle_files():
    # Read Content
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Asset Replacement Logic
    # 1. Replace assets in CSS (url('assets/...'))
    def replace_css_url(match):
        path = match.group(1).strip("'").strip('"')
        if path.startswith('assets/'):
             # Correct path relative to script execution
            full_path = path 
            data_uri = get_base64_image(full_path)
            return f"url('{data_uri}')"
        return match.group(0)

    css_content = re.sub(r"url\(([^)]+)\)", replace_css_url, css_content)

    # 2. Replace assets in HTML (src="assets/...")
    def replace_html_src(match):
        path = match.group(1)
        data_uri = get_base64_image(path)
        return f'src="{data_uri}"'
        
    html_content = re.sub(r'src="(assets/[^"]+)"', replace_html_src, html_content)
    
    # 3. Replace background-image inline styles in HTML
    def replace_inline_bg(match):
        path = match.group(1).strip("'").strip('"')
        data_uri = get_base64_image(path)
        return f"url('{data_uri}')"
        
    html_content = re.sub(r"url\('?(assets/[^')]+)'?\)", replace_inline_bg, html_content)

    # Clean HTML: Remove existing link/script tags to local files
    html_content = html_content.replace('<link rel="stylesheet" href="style.css">', '')
    html_content = html_content.replace('<script src="script.js"></script>', '')

    # Assemble Bundle
    # Google Sites Embed needs simple structure. 
    final_output = f"""
<!-- 
GOOGLE SITES EMBED CODE
Copy EVERYTHING below this line and paste it into the "Embed Code" box.
-->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    {css_content}
    </style>
    <!-- Fonts and GSAP CDN links are preserved from original HTML -->
</head>
<body>
    {html_content.split('<body>')[1].split('</body>')[0]}
    
    <script>
    {js_content}
    </script>
</body>
</html>
"""
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_output)
    
    print(f"Successfully created {OUTPUT_FILE}")

if __name__ == "__main__":
    bundle_files()

import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the main Slide & Fold link
    content = content.replace('<a href="#product-slide-fold" class="classic-dropdown-link"', '<a href="slide-fold.html" class="classic-dropdown-link"')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    """Create a CareerClock icon with briefcase design"""
    
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (purple gradient)
    for y in range(size):
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
   g = int(126 + (75 - 126) * ratio)
     b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b))
    
    # Draw rounded corners (approximate)
    corner_size = int(size * 0.15)
    draw.rectangle([(0, 0), (corner_size, corner_size)], fill=(102, 126, 234))
    draw.rectangle([(size-corner_size, 0), (size, corner_size)], fill=(102, 126, 234))
    draw.rectangle([(0, size-corner_size), (corner_size, size)], fill=(118, 75, 162))
    draw.rectangle([(size-corner_size, size-corner_size), (size, size)], fill=(118, 75, 162))
    
    # Draw briefcase icon in white
    padding = int(size * 0.2)
    icon_size = size - (padding * 2)
    
    if size >= 32:
        # Briefcase body
        body_width = int(icon_size * 0.8)
     body_height = int(icon_size * 0.6)
    body_x = padding + (icon_size - body_width) // 2
        body_y = padding + int(icon_size * 0.3)
        
        draw.rectangle(
          [(body_x, body_y), (body_x + body_width, body_y + body_height)],
      fill='white'
        )
        
        # Handle
  handle_width = int(body_width * 0.3)
      handle_height = int(icon_size * 0.15)
        handle_x = padding + (icon_size - handle_width) // 2
        handle_y = body_y - handle_height // 2
        
        draw.rectangle(
         [(handle_x, handle_y), (handle_x + handle_width, handle_y + handle_height)],
            fill='white'
        )
        
   # Lock detail
  lock_size = int(size * 0.08)
   lock_x = size // 2 - lock_size // 2
   lock_y = body_y + int(body_height * 0.4)
  
        draw.rectangle(
        [(lock_x, lock_y), (lock_x + lock_size, lock_y + lock_size)],
    fill=(102, 126, 234)
      )
    else:
     # Simple briefcase for small icons
 w = int(icon_size * 0.7)
    h = int(icon_size * 0.5)
     x = padding + (icon_size - w) // 2
 y = padding + int(icon_size * 0.35)
        
  draw.rectangle(
            [(x, y), (x + w, y + h)],
          fill='white'
        )
    
    # Save
    img.save(filename, 'PNG')
    print(f'? Created: {filename} ({size}x{size})')

def main():
  # Create icons directory if it doesn't exist
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
   os.makedirs(icons_dir)
        print(f'?? Created directory: {icons_dir}')
    
    # Generate all icon sizes
    sizes = [16, 32, 48, 128]
    
    print('\n?? Generating CareerClock Icons...\n')
    
    for size in sizes:
 filename = os.path.join(icons_dir, f'icon{size}.png')
 create_icon(size, filename)
    
    print('\n? All icons generated successfully!')
    print(f'?? Location: {os.path.abspath(icons_dir)}')
    print('\n?? Next steps:')
    print('1. Go to chrome://extensions/')
    print('2. Remove old CareerClock extension (if loaded)')
    print('3. Click "Load unpacked"')
    print('4. Select the extension folder')
    print('5. ? Extension should load without errors!')

if __name__ == '__main__':
    try:
    main()
    except ImportError:
    print('? Error: PIL (Pillow) not installed')
   print('\n?? Install with:')
        print('   pip install Pillow')
        print('\nOr use the HTML generator instead:')
   print('   Open generate-icons.html in your browser')

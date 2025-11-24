from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_icon(size):
    """Create a gradient icon with a briefcase emoji"""
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (simplified to solid color for PIL)
    # For a real gradient, you'd need more complex code
    color1 = (102, 126, 234)  # #667eea
  color2 = (118, 75, 162)   # #764ba2
    
    # Draw rounded rectangle background
    for y in range(size):
        # Gradient effect
      ratio = y / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
    g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
      
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Draw briefcase icon (simplified)
    if size >= 32:
        # Scale elements based on size
        padding = size // 5
        body_width = size - (2 * padding)
   body_height = size // 2
        
    # Draw white briefcase
        draw.rectangle(
            [(padding, size // 3), (size - padding, size // 3 + body_height)],
      fill=(255, 255, 255, 255)
     )
   
      # Draw handle
        handle_width = size // 3
     handle_x = (size - handle_width) // 2
        handle_y = size // 4
        draw.rectangle(
            [(handle_x, handle_y), (handle_x + handle_width, handle_y + size // 10)],
            outline=(255, 255, 255, 255),
            width=max(1, size // 32)
        )
    
    return img

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Generate icons
sizes = [16, 32, 48, 128]
for size in sizes:
  icon = create_gradient_icon(size)
 icon.save(f'icons/icon{size}.png', 'PNG')
    print(f'Generated icon{size}.png')

print('\nAll icons generated successfully!')

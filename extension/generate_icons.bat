@echo off
echo Generating basic PNG icons...
echo.
echo This script requires Python with Pillow installed.
echo If you don't have it, install with: pip install Pillow
echo.
python generate_icons.py
if %errorlevel% neq 0 (
    echo.
  echo Python or Pillow not found!
    echo.
    echo Alternative: Open icon-generator.html in Chrome and download icons manually.
    echo Then replace the files in the icons folder.
    pause
) else (
    echo.
  echo Icons generated successfully!
    echo You can now load the extension in Chrome.
    pause
)

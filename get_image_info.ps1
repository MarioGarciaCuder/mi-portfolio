Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('c:\Users\mario\Documents\LandingPage Portfolio\plantilla\images\pic08.jpg')
Write-Host "Dimensiones: $($img.Width)x$($img.Height) píxeles"
$img.Dispose()

Add-Type -AssemblyName System.Drawing

New-Item -ItemType Directory -Force -Path "public/images/templates/kandyan" | Out-Null

$img2Path = "C:/Users/sachi/.gemini/antigravity/brain/d5baf9db-13f3-409f-b298-c81b543c42fd/.user_uploaded/media_1791731848455_0e9b8879.png"
$bmp2 = [System.Drawing.Bitmap]::new($img2Path)

# 1. Couple illustration inside card (x: 50, y: 220, w: 195, h: 275)
$rectCouple = [System.Drawing.Rectangle]::new(50, 220, 195, 275)
$coupleBmp = $bmp2.Clone($rectCouple, $bmp2.PixelFormat)
$coupleBmp.Save("public/images/templates/kandyan/couple-art.png", [System.Drawing.Imaging.ImageFormat]::Png)
$coupleBmp.Dispose()

# 2. Perahera procession frieze (x: 18, y: 72, w: 255, h: 65)
$rectPerahera = [System.Drawing.Rectangle]::new(18, 72, 255, 65)
$peraheraBmp = $bmp2.Clone($rectPerahera, $bmp2.PixelFormat)
$peraheraBmp.Save("public/images/templates/kandyan/perahera-frieze.png", [System.Drawing.Imaging.ImageFormat]::Png)
$peraheraBmp.Dispose()

$bmp2.Dispose()

Write-Host "Kandyan assets cropped successfully!"

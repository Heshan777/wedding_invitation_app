Add-Type -AssemblyName System.Drawing

$img3Path = "C:/Users/sachi/.gemini/antigravity/brain/d5baf9db-13f3-409f-b298-c81b543c42fd/.user_uploaded/media_1791731869774_a7ac0abc.png"
$bmp3 = [System.Drawing.Bitmap]::new($img3Path)

# Photo 1 (left tall)
$rectPhoto1 = [System.Drawing.Rectangle]::new(30, 320, 110, 185)
$p1 = $bmp3.Clone($rectPhoto1, $bmp3.PixelFormat)
$p1.Save("public/images/templates/kandyan/gallery-1.png", [System.Drawing.Imaging.ImageFormat]::Png)
$p1.Dispose()

# Photo 2 (top right)
$rectPhoto2 = [System.Drawing.Rectangle]::new(148, 320, 110, 95)
$p2 = $bmp3.Clone($rectPhoto2, $bmp3.PixelFormat)
$p2.Save("public/images/templates/kandyan/gallery-2.png", [System.Drawing.Imaging.ImageFormat]::Png)
$p2.Dispose()

# Photo 3 (bottom right)
$rectPhoto3 = [System.Drawing.Rectangle]::new(148, 424, 110, 82)
$p3 = $bmp3.Clone($rectPhoto3, $bmp3.PixelFormat)
$p3.Save("public/images/templates/kandyan/gallery-3.png", [System.Drawing.Imaging.ImageFormat]::Png)
$p3.Dispose()

$bmp3.Dispose()

Write-Host "Kandyan gallery photos cropped successfully!"

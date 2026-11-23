Add-Type -AssemblyName System.Drawing

function Process-Logo($inputPath, $outputPath) {
    $bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $bmp.Width
    $h = $bmp.Height

    # Find non-white bounds
    $minX = $w
    $maxX = 0
    $minY = $h
    $maxY = 0

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $pixel = $bmp.GetPixel($x, $y)
            # Check if not pure/near white
            if ($pixel.R -lt 235 -or $pixel.G -lt 235 -or $pixel.B -lt 235) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    # Add 12px padding
    $pad = 12
    $cropX = [Math]::Max(0, $minX - $pad)
    $cropY = [Math]::Max(0, $minY - $pad)
    $cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($pad * 2))
    $cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + ($pad * 2))

    Write-Output "Processing $inputPath : crop rect = ($cropX, $cropY, $cropW, $cropH)"

    # Create new 32bpp transparent bitmap
    $outBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    for ($ny = 0; $ny -lt $cropH; $ny++) {
        for ($nx = 0; $nx -lt $cropW; $nx++) {
            $origX = $cropX + $nx
            $origY = $cropY + $ny
            $p = $bmp.GetPixel($origX, $origY)

            # Convert near-white to transparent, and anti-alias
            $brightness = ($p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114)
            if ($brightness -gt 240) {
                $outBmp.SetPixel($nx, $ny, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($brightness -gt 200) {
                # Semi-transparent edge for ultra-smooth anti-aliasing
                $alpha = [int](255 * (1.0 - ($brightness - 200) / 40.0))
                $outBmp.SetPixel($nx, $ny, [System.Drawing.Color]::FromArgb($alpha, 28, 25, 23))
            } else {
                # Solid dark charcoal/black
                $outBmp.SetPixel($nx, $ny, [System.Drawing.Color]::FromArgb(255, 28, 25, 23))
            }
        }
    }

    $outBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    $bmp.Dispose()
    Write-Output "Saved transparent PNG to $outputPath"
}

Process-Logo "public/assets/brands/ritz-carlton.jpg" "public/assets/brands/the-ritz-carlton.png"
Process-Logo "public/assets/brands/jw-marriott.jpg" "public/assets/brands/jw-marriott.png"
Process-Logo "public/assets/brands/st-regis.jpg" "public/assets/brands/st-regis.png"

# Also copy to src/assets/brands
Copy-Item "public/assets/brands/*.png" -Destination "src/assets/brands/" -Force
Write-Output "All 3 brand logos processed successfully!"

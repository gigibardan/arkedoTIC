import zlib
import struct
import math

def create_png(width, height, get_pixel_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter byte: 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel_func(x, y, width, height)
            raw_data.extend([int(r), int(g), int(b), int(a)])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png_bytes = bytearray(b'\x89PNG\r\n\x1a\n')
    # IHDR chunk: 13 bytes
    png_bytes.extend(chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)))
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), level=9)
    png_bytes.extend(chunk(b'IDAT', compressed))
    # IEND chunk
    png_bytes.extend(chunk(b'IEND', b''))
    return bytes(png_bytes)

def render_logo(x, y, w, h, is_maskable=False):
    # Normalized coords -1 to 1
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1

    # Safe zone scaling for maskable
    scale = 0.75 if is_maskable else 0.88
    sx = nx / scale
    sy = ny / scale

    # Background gradient
    diag = (nx + ny + 2) / 4 # 0 to 1
    # #0f172a (15, 23, 42) to #1e1b4b (30, 27, 75)
    bg_r = int(15 + diag * (30 - 15))
    bg_g = int(23 + diag * (27 - 23))
    bg_b = int(42 + diag * (75 - 42))

    # Rounded squircle boundary if not maskable
    if not is_maskable:
        # Superellipse |nx|^4 + |ny|^4 <= 0.85
        corner_dist = (abs(nx)**4.2 + abs(ny)**4.2)
        if corner_dist > 0.88:
            return 0, 0, 0, 0 # Transparent outside rounded icon
        elif corner_dist > 0.82:
            # Border glow (indigo)
            t = (corner_dist - 0.82) / 0.06
            return int(99*(1-t) + 15*t), int(102*(1-t) + 23*t), int(241*(1-t) + 42*t), 255

    r, g, b, a = bg_r, bg_g, bg_b, 255

    # Tech grid dots
    grid_x = (x % 32)
    grid_y = (y % 32)
    if (grid_x == 0 and grid_y == 0) and not is_maskable:
        r = min(255, r + 25)
        g = min(255, g + 25)
        b = min(255, b + 50)

    # Rocket rotation (-45 deg): rotate (sx, sy) by +45 deg to align rocket vertically
    rad = math.radians(45)
    rx = sx * math.cos(rad) - sy * math.sin(rad)
    ry = sx * math.sin(rad) + sy * math.cos(rad)
    # ry: negative is nose, positive is tail

    # Rocket flame: ry in [0.35, 0.75], abs(rx) < flame_w
    if 0.35 <= ry <= 0.78:
        flame_t = (ry - 0.35) / 0.43
        flame_w = (1 - flame_t) * 0.16 * math.sin(flame_t * math.pi)
        if abs(rx) < flame_w:
            # Yellow to orange-red
            fr = 255
            fg = int(190 * (1 - flame_t * 0.8))
            fb = int(40 * (1 - flame_t))
            return fr, fg, fb, 255

    # Rocket fins: ry in [0.15, 0.42], abs(rx) in [0.1, 0.38]
    if 0.18 <= ry <= 0.44:
        fin_t = (ry - 0.18) / 0.26
        if 0.10 <= abs(rx) <= (0.10 + fin_t * 0.26):
            return 67, 56, 202, 255 # Deep indigo #4338ca

    # Rocket fuselage: ry in [-0.55, 0.42]
    if -0.55 <= ry <= 0.42:
        fuse_t = (ry + 0.55) / 0.97 # 0 at nose, 1 at tail
        # Width curves out and then straightens
        max_w = 0.22 * math.sin(fuse_t * 2.2) if fuse_t < 0.7 else 0.22 * math.sin(0.7 * 2.2) * (1 - 0.15 * (fuse_t - 0.7))
        if abs(rx) <= max_w:
            # Gradient: Cyan (#38bdf8: 56, 189, 248) to Purple (#a855f7: 168, 85, 247)
            fr = int(56 + fuse_t * (168 - 56))
            fg = int(189 - fuse_t * (189 - 85))
            fb = int(248 - fuse_t * (248 - 247))
            
            # Nose cone accent
            if ry < -0.32:
                fr, fg, fb = 56, 189, 248

            # Porthole screen: centered at rx=0, ry=-0.05, radius=0.10
            port_dist = math.sqrt(rx*rx + (ry + 0.05)**2)
            if port_dist <= 0.12:
                if port_dist > 0.09:
                    return 224, 231, 255, 255 # Outer silver ring
                elif port_dist > 0.08:
                    return 15, 23, 42, 255 # Dark bezel
                else:
                    # Inside cyan screen with code prompt
                    if abs(rx) < 0.04 and abs(ry + 0.05) < 0.015:
                        return 255, 255, 255, 255 # Bright prompt
                    return 6, 182, 212, 255 # Cyan screen #06b6d4

            return fr, fg, fb, 255

    # Decorative sparkles / stars
    # Star 1: (-0.5, -0.3)
    d1 = math.sqrt((sx + 0.5)**2 + (sy + 0.3)**2)
    if d1 < 0.06:
        glow1 = 1 - (d1 / 0.06)
        return min(255, int(r + 56 * glow1)), min(255, int(g + 189 * glow1)), min(255, int(b + 248 * glow1)), 255

    # Star 2: (0.45, -0.4)
    d2 = math.sqrt((sx - 0.45)**2 + (sy + 0.4)**2)
    if d2 < 0.05:
        glow2 = 1 - (d2 / 0.05)
        return min(255, int(r + 251 * glow2)), min(255, int(g + 191 * glow2)), min(255, int(b + 36 * glow2)), 255

    return r, g, b, a

def main():
    sizes = [
        (192, 192, 'public/pwa-192x192.png', False),
        (512, 512, 'public/pwa-512x512.png', False),
        (512, 512, 'public/pwa-maskable-512x512.png', True),
        (180, 180, 'public/apple-touch-icon.png', False),
        (32, 32, 'public/favicon.ico', False),
    ]

    for w, h, path, maskable in sizes:
        print(f"Generating {path} ({w}x{h}, maskable={maskable})...")
        data = create_png(w, h, lambda px, py, pw, ph: render_logo(px, py, pw, ph, maskable))
        with open(path, 'wb') as f:
            f.write(data)
    print("All PWA PNG icons generated successfully!")

if __name__ == '__main__':
    main()

import os
import subprocess
import glob
from PIL import Image, ImageDraw, ImageFont

def create_watermark_image(text="cinememe.vercel.app"):
    # Create a small transparent image for the text
    # Size: 180x30 pixels is perfect for a clean watermark
    width, height = 180, 28
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to load standard macOS font, fallback if not found
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Geneva.ttf"
    ]
    
    font = None
    for path in font_paths:
        if os.path.exists(path):
            try:
                # Use font size 13
                font = ImageFont.truetype(path, 13)
                break
            except:
                pass
                
    if font is None:
        font = ImageFont.load_default()
        
    # Get text size using textbbox to center it
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
    except:
        text_w, text_h = 130, 13 # fallback estimate
        
    text_x = (width - text_w) // 2
    text_y = (height - text_h) // 2 - 1
    
    # Draw semi-transparent white text (70% opacity) with a thin black outline (70% opacity)
    draw.text((text_x, text_y), text, font=font, fill=(255, 255, 255, 180), stroke_width=1, stroke_fill=(0, 0, 0, 180))
    
    # Save the temporary watermark image
    watermark_path = "watermark_temp.png"
    img.save(watermark_path)
    return watermark_path

def watermark_videos():
    input_dir = "downloaded_videos"
    output_dir = "watermarked_videos"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    videos = glob.glob(os.path.join(input_dir, "*.mp4"))
    print(f"Found {len(videos)} videos to watermark.")
    
    if not videos:
        print("No videos found to process.")
        return
        
    # Generate the watermark PNG image
    watermark_file = create_watermark_image("cinememe.vercel.app")
    
    try:
        for index, video_path in enumerate(videos):
            filename = os.path.basename(video_path)
            output_path = os.path.join(output_dir, filename)
            
            print(f"[{index+1}/{len(videos)}] Watermarking {filename}...")
            
            # Use ffmpeg overlay filter to place the PNG at the bottom-right corner (15px padding)
            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-i", watermark_file,
                "-filter_complex", "overlay=main_w-overlay_w-15:main_h-overlay_h-15",
                "-c:a", "copy", # Copy audio stream without re-encoding (keeps quality, saves time)
                "-c:v", "libx264", "-preset", "fast", "-crf", "22",
                output_path
            ]
            
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            
        print("\nBatch watermarking completed! Watermarked files saved in 'watermarked_videos' folder.")
    finally:
        # Clean up the temporary watermark image
        if os.path.exists(watermark_file):
            os.remove(watermark_file)

if __name__ == "__main__":
    watermark_videos()

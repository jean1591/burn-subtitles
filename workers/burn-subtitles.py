import subprocess
import os
import sys
import glob

def run_command(command, quiet=False):
    if quiet:
        result = subprocess.run(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {command}")


def cleanup_temp_files(base_name):
    extensions_to_remove = ['.mp3', '.wav', '.txt', '.vtt', '.tsv', '.json']
    for ext in extensions_to_remove:
        file_path = f"{base_name}{ext}"
        if os.path.exists(file_path):
            print(f"Deleting {file_path}")
            os.remove(file_path)

def main(video_path):
    if not os.path.exists(video_path):
        print(f"Error: {video_path} not found.")
        return

    base_name = os.path.splitext(video_path)[0]

    # Step 1: Extract audio as WAV
    print("🔊 Extracting audio file...")
    wav_path = f"{base_name}.wav"
    run_command(f"ffmpeg -i {video_path} -vn -acodec pcm_s16le -ar 16000 -ac 1 {wav_path}", quiet=True)
    print("> Done")

    # Step 2: Transcribe with Whisper (auto-generates .srt and others)
    print("🤖 Processing speech to text...")
    run_command(f"whisper {wav_path} --language French --task transcribe", quiet=True)
    print("> Done")

    # Step 3: Find the generated .srt subtitle
    print("🔥 Burning subtiles to video file...")
    srt_file = glob.glob(f"{base_name}*.srt")
    if not srt_file:
        print("No .srt file found after Whisper transcription.")
        return
    srt_path = srt_file[0]

    # Step 4: Burn subtitles into the video
    print("🔥 Burning subtiles to video file...")
    output_video = f"{base_name}_with_subs.mp4"
    run_command(f'ffmpeg -i "{video_path}" -vf "subtitles={srt_path}" -c:v libx264 -c:a copy "{output_video}" -v quiet -hide_banner', quiet=True)
    print("> Done")

    # Step 5: Clean up intermediate files
    print("🧹 Deleting useless files...")
    cleanup_temp_files(base_name)
    print("> Done")

    print(f"\n✅ Done! Output file: {output_video}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 main.py path/to/video.mp4")
    else:
        main(sys.argv[1])

import os, requests, tinify
from dotenv import load_dotenv

load_dotenv()

tinify.key = os.environ.get("tinify_key")

output_dir = "build"

try:
    os.mkdir(output_dir)
except FileExistsError:
    print("It's already there!!!")

output_dir += "/"

for ff in os.listdir():
    print(ff)
    if ff.endswith(".png"):
        if (ff == "logothing.png"):
            continue

        source = tinify.from_file(ff)
        source.to_file(f'{output_dir}{ff}')
    if ff.endswith(".mp3"):
        fle = open(ff, "rb")
        dst = open(f'{output_dir}{ff}', "wb+")
        dst.write(fle.read())
        fle.close()
        dst.close()

os.system(f"terser lzs.js letters.js game.js --mangle --compress -o {output_dir}code.js")
try:
    os.system(f"rm {output_dir}dbh.zip")
except:
    print("no need to delete anything")
os.system(f"advzip {output_dir}dbh.zip --add build --shrink-insane -4")

try:
    progress = os.path.getsize(f"{output_dir}dbh.zip") / 1024

    # make a loading bar showing progress to 13KB
    print(f"[{'#'*(int((progress/13)*100)//10)}] {((progress/13)*100)}% ({round(progress, 3)} KB / 13 KB)")
except:
    print("Done!")

import os
import json


def generate_wallpaper_json():
    # Target the actual folder where images live
    search_dir = os.path.join("src", "assets")
    all_wallpapers = []
    valid_extensions = (".webp", ".jpg", ".png", ".jpeg")

    if not os.path.exists(search_dir):
        print(f"❌ Error: Could not find directory {search_dir}")
        return

    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file.lower().endswith(valid_extensions):
                # full_path: src/assets/abstract/mecha_01.webp
                full_path = os.path.join(root, file)

                # relative_to_src: abstract/mecha_01.webp
                relative_to_assets = os.path.relpath(full_path, search_dir)

                # Format for Flutter
                # We keep 'assets/' prefix for the app's internal logic
                flutter_path = f"assets/{relative_to_assets.replace('\\', '/')}"

                # Get the Category (e.g., 'abstract', 'anime')
                path_parts = relative_to_assets.replace("\\", "/").split("/")
                category = (
                    path_parts[0].capitalize() if len(path_parts) > 1 else "Other"
                )

                filename_no_ext = os.path.splitext(file)[0]
                title = filename_no_ext.replace("_", " ").replace("-", " ").title()
                slug = filename_no_ext.replace("_", "-")

                all_wallpapers.append(
                    {
                        "title": title,
                        "slug": slug,
                        "category": category,
                        "imagePath": flutter_path,
                    }
                )

    all_wallpapers.sort(key=lambda x: (x["category"], x["title"]))

    # Save to the public folder where Github Pages/Helper looks
    output_path = os.path.join("public", "wallpapers.json")
    os.makedirs("public", exist_ok=True)  # Ensure public dir exists

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"wallpapers": all_wallpapers}, f, indent=2)

    print(f"✅ Success! Generated {output_path} with {len(all_wallpapers)} items.")


if __name__ == "__main__":
    generate_wallpaper_json()

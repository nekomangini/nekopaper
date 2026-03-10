import os
import json

def generate_wallpaper_json():
    # Use '.' because you are already inside the assets folder
    search_dir = '.' 
    all_wallpapers = []

    # These are the extensions we want to catch
    valid_extensions = ('.webp', '.jpg', '.png', '.jpeg')

    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file.lower().endswith(valid_extensions):
                # Calculate the path relative to where you are
                relative_path = os.path.relpath(os.path.join(root, file), search_dir)
                
                # Format for Flutter (forward slashes, starting with assets/)
                flutter_path = f"assets/{relative_path.replace('\\', '/')}"
                
                # Get the Category (the first folder name)
                path_parts = relative_path.replace('\\', '/').split('/')
                category = path_parts[0].capitalize() if len(path_parts) > 1 else "Other"
                
                # Cleanup filename for Title and Slug
                filename_no_ext = os.path.splitext(file)[0]
                title = filename_no_ext.replace('_', ' ').replace('-', ' ').title()
                slug = filename_no_ext.replace('_', '-')

                all_wallpapers.append({
                    "title": title,
                    "slug": slug,
                    "category": category,
                    "imagePath": flutter_path
                })

    # Sort them by category so the JSON is organized
    all_wallpapers.sort(key=lambda x: x['category'])

    with open('wallpapers.json', 'w', encoding='utf-8') as f:
        json.dump({"wallpapers": all_wallpapers}, f, indent=2)
    
    print(f"✅ Success! Generated wallpapers.json with {len(all_wallpapers)} items.")

if __name__ == "__main__":
    generate_wallpaper_json()

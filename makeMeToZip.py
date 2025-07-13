import shutil
import os

# Define the path to the folder you want to zip
source_folder = 'I:\\workspace\\Avery\\oxprj\\oxprj' 

# Define the desired path and name for the output zip file (without the .zip extension)
output_archive_name = 'I:\\workspace\\Avery\\oxprj\\oxprj' 

# Create the zip archive
# The first argument is the base name of the archive (without extension)
# The second argument is the format ('zip' for .zip, 'tar' for .tar, etc.)
# The third argument is the root directory to archive
shutil.make_archive(output_archive_name, 'zip', source_folder)

print(f"Folder '{source_folder}' has been zipped to '{output_archive_name}.zip'")
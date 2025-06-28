import subprocess

UNSIGNED_APK = "my mci hack.apk"
SIGNED_APK = "simmh.apk"
KEYSTORE_PATH = "mykeystore.jks"
KEYSTORE_ALIAS = "metroboomin"
KEYSTORE_PASS = "metroboomin"
KEY_PASS = "metroboomin" # Often same as keystore_pass

zipalign_command = [
    f"zipalign",
    "-v",
    "4",
    UNSIGNED_APK,
    SIGNED_APK # Zipalign creates a new aligned APK
]
subprocess.run(zipalign_command, check=True)
print("APK zipaligned successfully.")

apksigner_command = [
    f"apksigner",
    "sign",
    "--ks", KEYSTORE_PATH,
    "--ks-key-alias", KEYSTORE_ALIAS,
    "--ks-pass", f"pass:{KEYSTORE_PASS}",
    "--key-pass", f"pass:{KEY_PASS}",
    "--out", SIGNED_APK, # Output of apksigner is the signed APK
    SIGNED_APK # Input to apksigner is the zipaligned APK
]
subprocess.run(apksigner_command, check=True)
print("APK signed successfully.")
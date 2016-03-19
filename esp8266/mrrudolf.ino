#include <ESP8266WiFi.h>

const char* ssid     = "Your_Network";
const char* password = "Your_Network_Password";

void setup() {
  delay(2000);
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  sendRequest();
}

void sendRequest () {
  const char* host = "mrrudolf.yourdomain.com";
  const int httpPort = 80;

  Serial.print("connecting to ");
  Serial.println(host);

  // Use WiFiClient class to create TCP connections
  WiFiClient client;

  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  // We now create a URI for the request
  String url = "/api/token123/dingDong";
  Serial.print("Requesting URL: ");
  Serial.println(url);

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");

  Serial.println("Hello! Ding dong!");
  Serial.println("closing connection");

  delay(2000);
  // Go to Winter Sleep again
  ESP.deepSleep(0);
}

void loop() {}

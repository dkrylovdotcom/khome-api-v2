#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
 
// Settings
const char* ssid = "KHOME";
const char* password = "q12345";
const char* deviceId = "room1-device1";
const char* mqttHost = "192.168.0.5";
const int mqttPort = 1883;
const char* mqttTopic = "61d2bfd71d3d6e69f6f53141-LIGHT";
const byte ledPin = LED_BUILTIN;

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  DynamicJsonDocument doc(1024);
  auto error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed with code "));
    Serial.println(error.c_str());
    return;
  }
  const char* deviceId = doc["deviceId"];
  const bool state = doc["state"];
  
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  if(state) {
    digitalWrite(ledPin, LOW);
    Serial.print("state true");
  } else {
    digitalWrite(ledPin, HIGH);
    Serial.print("state false");
  }
  Serial.println();
}
 
 
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Attempt to connect
    if (client.connect("ESP8266 Client")) {
      Serial.println("connected");
      client.subscribe(mqttTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void connectToWifi() {
  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}
 
void setup() {
  Serial.begin(9600);
  client.setServer(mqttHost, mqttPort);
  client.setCallback(callback);
  pinMode(ledPin, OUTPUT);
  connectToWifi();
}
 
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
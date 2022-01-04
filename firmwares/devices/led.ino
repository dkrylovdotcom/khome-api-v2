#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <ArduinoJson.h>
 
// Settings
const char* ssid = "KHOME";
const char* password = "dkrylov.com";
const char* mqttServer = "192.168.0.3";
const char* deviceId = "esp1";
const char* mqttTopic = deviceId;
 
WiFiClient espClient;
PubSubClient client(espClient);
 
const byte ledPin = LED_BUILTIN;
 
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
 
void setup() {
  Serial.begin(9600);
  client.setServer(mqttServer, 1883);
  client.setCallback(callback);
  pinMode(ledPin, OUTPUT);
}
 
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

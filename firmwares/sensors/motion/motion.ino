#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Pins
static const uint8_t D0   = 16;
static const uint8_t D1   = 5;
static const uint8_t D2   = 4;
static const uint8_t D3   = 0;
static const uint8_t D4   = 2;
static const uint8_t D5   = 14;
static const uint8_t D6   = 12;
static const uint8_t D7   = 13;
static const uint8_t D8   = 15;
static const uint8_t D9   = 3;
static const uint8_t D10  = 1;

// Settings
const char* ssid = "KHOME";
const char* password = "q12345";
const char* deviceId = "room1-device1";
const char* mqttHost = "192.168.0.5";
const int mqttPort = 1883;
const char* mqttTopic = "61d2bfd71d3d6e69f6f53141-MOTION_SENSOR";
const int serialSpeed = 9600;

int alarmCount = 0;
const int maxAlarmCount = 15;
const int loopDelay = 200;

WiFiClient espClient;
PubSubClient client(espClient);

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  Serial.println("-----");
  motionRead();
  
  if(alarmCount >= maxAlarmCount) {
    alarmCount = 0;
    publishMessage(deviceId, "1");
    Serial.println("Motion detected!");
  }
  
  delay(loopDelay);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Attempt to connect
    if (client.connect("ESP8266 Client")) {
      Serial.println("connected");
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
  Serial.begin(serialSpeed);
  connectToWifi();
  client.setServer(mqttHost, mqttPort);
  pinMode(D2, INPUT);
}

void publishMessage(String deviceId, String value) {
  DynamicJsonDocument doc(200);
  char jsonString[200];
  doc["deviceId"] = deviceId;
  doc["value"] = value;
  serializeJson(doc, jsonString);
  client.publish(mqttTopic, jsonString, true);
  Serial.println("Published!");
}

void motionRead() {
  if(digitalRead(D2) == HIGH) {
    int motion = digitalRead(D2);
    Serial.println(motion);
    alarmCount++;
  } else {
    alarmCount = 0;
    Serial.println("no trigger");
  }
}

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Settings
const char* ssid = "KHOME";
const char* password = "dkrylov.com";
const char* mqttServer = "192.168.0.3";
const char* deviceId = "esp2";
const char* mqttTopic = deviceId;

WiFiClient espClient;
PubSubClient client(espClient);

String motion;
int alarmCount = 0;
const int maxAlarmCount = 40;

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

void setup() {
  client.setServer(mqttServer, 1883);
  pinMode(D6, INPUT);
  delay(2000);
  Serial.begin(9600);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();


 if(digitalRead(D6) == HIGH) {
   motion = digitalRead(D6);
   alarmCount++;
   Serial.println(alarmCount);
  } else {
    alarmCount = 0;
    // Serial.println("no trigger");
  }

  if(alarmCount >= maxAlarmCount) {
    alarmCount = 0;
    Serial.println("Alarm detected!");

    DynamicJsonDocument doc(200);
    char jsonString[200];
    doc["deviceId"] = deviceId;
    doc["message"] = "Motion detected!";
    serializeJson(doc, jsonString);
    client.publish(mqttTopic, jsonString, true);
  }
  
  delay(100);
}

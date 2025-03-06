//This example code is in the Public Domain (or CC0 licensed, at your option.)
//By Evandro Copercini - 2018
//
//This example creates a bridge between Serial and Classical Bluetooth (SPP)
//and also demonstrate that SerialBT have the same functionalities of a normal Serial

#include <ArduinoBLE.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BLEService padService("00001802-0000-1000-8000-00805f9b34fb"); // Bluetooth® Low Energy LED Service
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify);
int ledPin = LED_BUILTIN;
int button1 = 23;
int button1LastState = 0;

void setup() {
  Serial.begin(115200);
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");
  }

  pinMode(ledPin, OUTPUT);
  pinMode(button1, INPUT);
  digitalWrite(ledPin, LOW);

  BLE.setLocalName("Sam touch pad");
  BLE.setAdvertisedService(padService);

  padService.addCharacteristic(switchCharacteristic);
  BLE.addService(padService);

  switchCharacteristic.setValue(0);
  BLE.advertise();
}

void loop(){
    BLE.poll();
    if (digitalRead(button1) == HIGH) {
      if (button1LastState == 0) {
        Serial.println("PRESSED");
        button1LastState = 1;
        switchCharacteristic.writeValue(1);
      }
    } else {
      if(button1LastState == 1) {
        Serial.println("RELEASED");
        button1LastState = 0;
        switchCharacteristic.writeValue(0);
      }
    }
}

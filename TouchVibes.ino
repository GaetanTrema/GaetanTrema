//This example code is in the Public Domain (or CC0 licensed, at your option.)
//By Evandro Copercini - 2018
//
//This example creates a bridge between Serial and Classical Bluetooth (SPP)
//and also demonstrate that SerialBT have the same functionalities of a normal Serial

#include <ArduinoBLE.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BLEService vibrationService("00001802-0000-1000-8000-00805f9b34fb"); // Bluetooth® Low Energy LED Service
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
int ledPin = LED_BUILTIN;


void setup() {
  Serial.begin(115200);
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");
  }

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  BLE.setLocalName("TEST");
  BLE.setAdvertisedService(vibrationService);

  vibrationService.addCharacteristic(switchCharacteristic);
  BLE.addService(vibrationService);

  switchCharacteristic.setEventHandler(BLEWritten, switchCharacteristicWritten);
  switchCharacteristic.setValue(0);
  BLE.advertise();
}

void loop(){
    BLE.poll();
}

void switchCharacteristicWritten(BLEDevice central, BLECharacteristic characteristic) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic event, written: ");

  if (switchCharacteristic.value()) {
    Serial.println("LED on");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("LED off");
    digitalWrite(ledPin, LOW);
  }
}

#define SWITCH_PIN D7


void setup() {
  Serial.begin(115200);

  Particle.function("state", setSwitchState);
}


int setSwitchState(String state) {
  Serial.println("state: " + state);

  if(state == "on") {
    digitalWrite(SWITCH_PIN, HIGH);
  }
  else if(state == "off") {
    digitalWrite(SWITCH_PIN, LOW);
  }
}


void loop() {
    
}

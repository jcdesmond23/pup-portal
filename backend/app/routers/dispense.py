from fastapi import APIRouter
import RPi.GPIO as GPIO
import time
from typing import Dict

# Configure GPIO
SERVO_PIN = 18  # GPIO pin number for servo motor
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)  # 50 Hz frequency
pwm.start(0)

router = APIRouter(
    prefix="/dispense",
    tags=["Dispense"],
)

def set_angle(angle: float) -> None:
    """Convert angle to duty cycle and set servo position"""
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN, True)
    pwm.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN, False)
    pwm.ChangeDutyCycle(0)

@router.post("/")
async def dispense() -> Dict[str, str]:
    """
    Trigger servo to dispense treats.
    The servo will rotate to dispense position and then return to starting position.
    """
    try:
        # Rotate to dispense position (adjust angles as needed)
        set_angle(90)
        time.sleep(1)
        # Return to starting position
        set_angle(0)
        return {"message": "Treats dispensed successfully"}
    except Exception as e:
        return {"message": f"Error dispensing treats: {str(e)}"}

# Cleanup GPIO on module unload
def cleanup():
    pwm.stop()
    GPIO.cleanup()

import atexit
atexit.register(cleanup)

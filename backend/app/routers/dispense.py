from typing import Dict

from fastapi import APIRouter, HTTPException, status
import RPi.GPIO as GPIO
import time

# Configure GPIO
SERVO_PIN = 18  # GPIO pin number for servo motor
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)  # 50 Hz frequency
pwm.start(0)

router = APIRouter(tags=["dispense"])

def set_angle(angle: float) -> None:
    """
    Convert angle to duty cycle and set servo position.

    Args:
        angle: The angle to set the servo to (in degrees)
    """
    duty = angle / 18 + 2
    GPIO.output(SERVO_PIN, True)
    pwm.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN, False)
    pwm.ChangeDutyCycle(0)

@router.post("/dispense", response_model=Dict[str, str])
async def dispense() -> Dict[str, str]:
    """
    Trigger servo to dispense treats.

    Returns:
        Dict[str, str]: A message indicating success or failure
    
    Raises:
        HTTPException: If there's an error during dispensing
    """
    try:
        # Rotate to dispense position, sleep and return to starting position
        set_angle(90)
        time.sleep(1)
        set_angle(0)
        return {"message": "Treats dispensed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error dispensing treats: {str(e)}"
        )

# Cleanup GPIO on module unload
def cleanup() -> None:
    """Clean up GPIO resources on program exit."""
    pwm.stop()
    GPIO.cleanup()

import atexit
atexit.register(cleanup)

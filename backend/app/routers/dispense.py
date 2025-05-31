from typing import Dict

from fastapi import APIRouter, HTTPException, status
import RPi.GPIO as GPIO
import time
import atexit

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
    time.sleep(0.1)
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)
    time.sleep(0.1)
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
        set_angle(110)
        set_angle(135) # 135 degrees is the angle the servo starts at 
        return {"message": "Treats dispensed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error dispensing treats: {str(e)}"
        )

# Register cleanup function to run at interpreter shutdown
def gpio_cleanup():
    pwm.stop()
    GPIO.cleanup()

atexit.register(gpio_cleanup)

from typing import Dict, Annotated

from fastapi import APIRouter, HTTPException, status, Depends
import RPi.GPIO as GPIO
import time
import atexit

from ..routers.token import get_current_active_user

# Configure GPIO
SERVO_PIN = 18
SERVO_START_POSITION = 155

GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)
pwm.start(0)

router = APIRouter(tags=["dispense"])

def set_angle(angle: float) -> None:
    """
    Convert angle to duty cycle and set servo position.
    
    Args:
        angle: The angle to set the servo to
    """
    duty = 5.0 + (angle / 180.0) * 5.0
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)
    pwm.ChangeDutyCycle(0)

@router.post("/dispense", response_model=Dict[str, str])
async def dispense(
    current_user: Annotated[Dict, Depends(get_current_active_user)]
) -> Dict[str, str]:
    """
    Trigger servo to dispense treats by moving 45 degrees and returning to start.

    Returns:
        Dict[str, str]: A message indicating success or failure
    
    Raises:
        HTTPException: If there's an error during dispensing
    """
    try:
        # Move 30 degrees from starting position
        dispense_angle = SERVO_START_POSITION - 45
        
        set_angle(dispense_angle)
        time.sleep(0.3)
        set_angle(SERVO_START_POSITION)
        
        return {"message": "Treats dispensed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error dispensing treats: {str(e)}"
        )

# Register cleanup function to run at interpreter shutdown
def gpio_cleanup():
    """Clean up GPIO resources on shutdown."""
    pwm.stop()
    GPIO.cleanup()

atexit.register(gpio_cleanup)

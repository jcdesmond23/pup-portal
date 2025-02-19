
from fastapi import APIRouter

router = APIRouter(
    prefix="/dispense",
    tags=["Dispense"],
)

@router.post("/")
async def dispense():
    """Trigger servo to dispense treats"""
    print("Dispensing treats")
    return {"message": "Treats dispensed"}

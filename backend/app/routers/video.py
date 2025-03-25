import asyncio
import io
import logging
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from picamera2 import Picamera2

router = APIRouter(tags=["video"])

@router.get("/video", response_class=StreamingResponse)
async def video_stream() -> StreamingResponse:
    """
    Stream video from the camera using picamera2.

    Returns:
        StreamingResponse: A streaming response containing MJPEG frames
    
    Raises:
        HTTPException: If camera initialization fails
    """
    camera = Picamera2()
    
    try:
        # Configure and start the camera
        config = camera.create_still_configuration(main={"size": (640, 480)})
        camera.configure(config)
        camera.start()
        await asyncio.sleep(2)  # Give camera time to initialize
        
        async def generate() -> AsyncGenerator[bytes, None]:
            try:
                while True:
                    stream = io.BytesIO()
                    camera.capture_file(stream, format='jpeg')
                    stream.seek(0)
                    yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + stream.getvalue() + b'\r\n'
                    await asyncio.sleep(1/30)  # 30 FPS
            finally:
                camera.stop()
                camera.close()
        
        return StreamingResponse(
            generate(),
            media_type='multipart/x-mixed-replace; boundary=frame'
        )
        
    except Exception as e:
        logging.error(f"Camera initialization error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to initialize camera"
        )
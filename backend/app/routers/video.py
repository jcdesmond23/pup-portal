from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
import io
import logging
from PIL import Image
from typing import AsyncIterator
from contextlib import asynccontextmanager

try:
    from picamera2 import Picamera2
    PICAMERA_AVAILABLE = True
except Exception as e:
    PICAMERA_AVAILABLE = False
    logging.warning(f"picamera2 not available: {e}")

router = APIRouter()

class MockCamera:
    def __init__(self):
        self.resolution = (640, 480)
        
    def capture_file(self, stream):
        # Create a test pattern
        img = Image.new('RGB', self.resolution, color='gray')
        img.save(stream, format='jpeg')

@asynccontextmanager
async def get_camera():
    """Context manager for camera access."""
    if not PICAMERA_AVAILABLE:
        camera = MockCamera()
        try:
            yield camera
        finally:
            pass
    else:
        camera = Picamera2()
        try:
            config = camera.create_still_configuration(main={"size": (640, 480)})
            camera.configure(config)
            camera.start()
            await asyncio.sleep(2)
            yield camera
        except Exception as e:
            logging.error(f"Camera initialization error: {e}")
            raise HTTPException(
                status_code=503,
                detail="Failed to initialize camera"
            )
        finally:
            camera.stop()
            camera.close()

@router.get("/stream")
async def video_stream():
    """Stream video from the camera."""
    async with get_camera() as camera:
        async def generate() -> AsyncIterator[bytes]:
            while True:
                try:
                    stream = io.BytesIO()
                    if PICAMERA_AVAILABLE:
                        camera.capture_file(stream, format='jpeg')
                    else:
                        camera.capture_file(stream)
                    
                    stream.seek(0)
                    
                    yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + stream.getvalue() + b'\r\n'
                    await asyncio.sleep(1/30)
                except Exception as e:
                    logging.error(f"Frame capture error: {e}")
                    raise HTTPException(
                        status_code=503,
                        detail="Failed to capture frame"
                    )

        return StreamingResponse(
            generate(),
            media_type='multipart/x-mixed-replace; boundary=frame'
        )
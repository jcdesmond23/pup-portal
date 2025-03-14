from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import dispense_router, token_router, video_router

app = FastAPI(
    title="Pup Portal Backend",
    description="Backend API for Pup Portal",
    version="0.1.0"
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(token_router)
app.include_router(dispense_router)
app.include_router(video_router)

@app.get("/")
async def root():
    """
    Root endpoint to confirm the API is running
    """
    return {"message": "Welcome to Pup Portal Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

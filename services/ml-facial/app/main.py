from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import face_recognition
import numpy as np
from PIL import Image
import io

app = FastAPI(title="Yarvan ML Facial", version="1.0.0")

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ml-facial",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.post("/verify")
async def verify_faces(
    reference: UploadFile = File(...),
    candidate: UploadFile = File(...)
):
    try:
        # Load images
        ref_image = face_recognition.load_image_file(io.BytesIO(await reference.read()))
        cand_image = face_recognition.load_image_file(io.BytesIO(await candidate.read()))
        
        # Get face encodings
        ref_encodings = face_recognition.face_encodings(ref_image)
        cand_encodings = face_recognition.face_encodings(cand_image)
        
        if not ref_encodings or not cand_encodings:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected in one or both images"}
            )
        
        # Compare faces
        distance = face_recognition.face_distance([ref_encodings[0]], cand_encodings[0])[0]
        is_match = distance < 0.6  # Threshold for match
        
        return {
            "match": is_match,
            "confidence": float(1 - distance),
            "distance": float(distance)
        }
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
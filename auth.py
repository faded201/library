from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import jwt, os

JWT_SECRET = os.getenv('JWT_SECRET', 'xavier-os-secret-key-change-in-prod')
security = HTTPBearer()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    display_name: str
    password: str

app = FastAPI(title='Xavier OS Auth')

def verify_token(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload['user_id']
    except:
        raise HTTPException(401, 'Invalid token')

@app.post('/register')
def register(req: RegisterRequest):
    user_id = f"user_{hash(req.email)}"
    token = jwt.encode({'user_id': user_id}, JWT_SECRET, algorithm="HS256")
    return {'user_id': user_id, 'token': token}

@app.post('/login')
def login(req: LoginRequest):
    user_id = f"user_{hash(req.email)}"
    token = jwt.encode({'user_id': user_id}, JWT_SECRET, algorithm="HS256")
    return {'user_id': user_id, 'token': token}

@app.get('/profile/{user_id}', dependencies=[Depends(verify_token)])
def profile(user_id: str, current_user: str = Depends(verify_token)):
    return {'user_id': user_id, 'email': f'{user_id}@xavier.os'}

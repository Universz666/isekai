from passlib.context import CryptContext

pwd_contex = CryptContext(schemes=["bcrypt"])

def hash_password(password: str):
    return pwd_contex.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_contex.verify(plain_password, hashed_password)
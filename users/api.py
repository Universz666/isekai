from datetime import datetime
from typing import Optional
from fastapi import Form, HTTPException, status, UploadFile, File
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from pydantic import BaseModel

from users import service as service
from utils import cryptoUtil

import uuid

user_router = InferringRouter()
FILEDIR = "./portfoliofile/portfiles/"


class usersModel(BaseModel):
    email: str
    username: str
    fullName: str
    phone: str
    role: str
    approve: bool = 0
    lineNotify: bool = 0
    create_date = datetime.now()

    # if role = student
    school: Optional[str] = None
    province: Optional[str] = None
    file: Optional[str] = None

    # if role = teacher
    faculty: Optional[str] = None
    majors: Optional[str] = None
    description: Optional[str] = None

class updateUsersModel(BaseModel):
    id:int
    email: str
    username: str
    fullName: str
    phone: str
    role: str
    approve: bool = 0
    lineNotify: bool = 0
    # if role = student
    school: Optional[str] = None
    province: Optional[str] = None
    file: Optional[str] = None
    # if role = teacher
    faculty: Optional[str] = None
    majors: Optional[str] = None
    description: Optional[str] = None

class Login(BaseModel):
    email:str

class AdminUser(BaseModel):
    email: str
    password: str


@cbv(user_router)
class UsersApi:
    @user_router.post('/loginUser')
    async def login(self,Login: Login):
        result = await service.find_user_byEmail(Login.email)
        if not result:
            raise HTTPException(status_code=400, detail="Email not registered!")

        return{
            "usersData":result
        }


    @user_router.post('/register-students/uploadfile', status_code=201)
    async def student_uploadfile(self, file: UploadFile = File(...)):
        txtfile = file.filename
        txtfile = txtfile.split(".")
        uuids = uuid.uuid4()
        file.filename = f"{uuids}.{txtfile[-1]}"
        contents = await file.read()

        with open(f"{FILEDIR}{file.filename}", "wb") as f:
            f.write(contents)

        return {
            "portfilename": file.filename
        }

    @user_router.post('/register', status_code=201)
    async def register_user(self, usersModel: usersModel):
        if usersModel.role == "student":
            result = await service.create_user_student(usersModel.email,
                                              usersModel.username,
                                              usersModel.fullName,
                                              usersModel.phone,
                                              usersModel.role,
                                              usersModel.approve,
                                              usersModel.lineNotify,
                                              usersModel.create_date,
                                              usersModel.school,
                                              usersModel.province,
                                              usersModel.file
                                              )
        if usersModel.role == "teacher":
            result = await service.create_user_teacher(usersModel.email,
                                              usersModel.username,
                                              usersModel.fullName,
                                              usersModel.phone,
                                              usersModel.role,
                                              usersModel.approve,
                                              usersModel.lineNotify,
                                              usersModel.create_date,
                                              usersModel.faculty,
                                              usersModel.majors,
                                              usersModel.description
                                              )

        return {
            "status_code": status.HTTP_201_CREATED,
            "detail": "User registerd successfully",
            "userId":result
        }

    @user_router.post('/CreateAdmin', status_code=201)
    async def Create_Admin(self, email:str , username:str, role:str, password:str ):
        
        password = cryptoUtil.hash_password(password)
        role = "admin"
        await service.create_admin(email, username, role , password)

        return {
             "status_code": status.HTTP_201_CREATED,
            "detail": "Admin Created Successfully"
        }
        
    
    @user_router.post('/login_email')
    async def emailLogin(self, AdminUser:AdminUser):
        result = await service.find_exist_admin_email(AdminUser.email)
        if not result:
            raise HTTPException(
                status_code=400, detail="Invalid email or password."
            )
        verify_password = cryptoUtil.verify_password(
            AdminUser.password, result[11]
        )
        if not verify_password:
            raise HTTPException(
                status_code=400, detail="Invalid username or password.")

        return{
            "id":result[0],
            "email":result[1],
            "username":result[2],
            "fullName":result[3],
            "role":result[5]
        }


    @user_router.post('/update-user')
    async def update_user(self, updateUsersModel: updateUsersModel):
        if updateUsersModel.role == "student":
            await service.update_user_student(updateUsersModel.email,
                                              updateUsersModel.username,
                                              updateUsersModel.fullName,
                                              updateUsersModel.phone,
                                              updateUsersModel.role,
                                              updateUsersModel.approve,
                                              updateUsersModel.lineNotify,
                                              updateUsersModel.school,
                                              updateUsersModel.province,
                                              updateUsersModel.file,
                                              updateUsersModel.id
                                              )
        if updateUsersModel.role == "teacher":
            await service.update_user_teacher(updateUsersModel.email,
                                              updateUsersModel.username,
                                              updateUsersModel.fullName,
                                              updateUsersModel.phone,
                                              updateUsersModel.role,
                                              updateUsersModel.approve,
                                              updateUsersModel.lineNotify,
                                              updateUsersModel.faculty,
                                              updateUsersModel.majors,
                                              updateUsersModel.description,
                                              updateUsersModel.id
                                              )

        return {
            "status_code": status.HTTP_200_OK,
            "detail": "User Updated successfully"
        }

    @user_router.post('delete_user')
    async def delete__user(self, role: str = Form(...), id: int = Form(...)):
        if role == "student":
            await service.del_user_student(id)

        if role == "teacher":
            await service.del_user_teacher(id)

        return {
            "status_code": status.HTTP_200_OK,
            "detail": "User Deleted successfully"
        }

    @user_router.get('/getAllUser')
    async def get_all_user(self):
        result = await service.get_all_users()
        return {
            "status_code": status.HTTP_200_OK,
            "detail": result
        }

from datetime import datetime
from fastapi import Form, HTTPException, status, UploadFile, File
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from pydantic import BaseModel

from events import service as service

event_router = InferringRouter()

class CreateEventModel(BaseModel):
    title: str
    faculty: str
    major: str
    startDate: str
    CreateByUserID: int
    requrl:str
    
class UpdateEventModel(BaseModel):
    title: str
    faculty: str
    major: str
    startDate: str
    CreateByUserID: int
    id: int



@cbv(event_router)
class EventApi:
    @event_router.post('/createEvents', status_code=201)
    async def create_Event(self, CreateEventModel: CreateEventModel):
        startDate = datetime.strptime(CreateEventModel.startDate, '%Y-%m-%d %H:%M:%S')

        await service.create_event_interview(CreateEventModel.title, CreateEventModel.faculty, CreateEventModel.major, startDate, CreateEventModel.CreateByUserID, CreateEventModel.requrl)
        return {
            "status_code": status.HTTP_201_CREATED,
            "detail": "Event Created Successfully"
        }
    
    @event_router.post('/updateEvents', status_code=200)
    async def update_Event(self, UpdateEventModel: UpdateEventModel):
        startDate = datetime.strptime(UpdateEventModel.startDate, '%Y-%m-%d %H:%M:%S')
        await service.update_event_interview(UpdateEventModel.title, UpdateEventModel.faculty, UpdateEventModel.major, startDate, UpdateEventModel.CreateByUserID, UpdateEventModel.id)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Event Update Successfully"
        }


    @event_router.get('/eventInterview')
    async def eventInterview(self):
        result = await service.getEventInterview()
        return {
            "status_code": status.HTTP_200_OK,
            "detail": result
        }

    @event_router.get('eventInterview/{requrl}')
    async def eventInterviewById(self, requrl:str):
        result = await service.get_EventById(requrl)
        if not result:
            raise HTTPException(status_code=400, detail="ไม่มีเวนท์")

        return {
            "status_code": status.HTTP_200_OK,
            "detail": result
        }

    @event_router.post('delete_Event', status_code=200)
    async def delete_Event(self, id):
        await service.del_event(id)

        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Event Deleted Successfully"
        }

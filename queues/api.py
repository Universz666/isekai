from datetime import datetime
from fastapi import HTTPException, status, Form, WebSocket
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from pydantic import BaseModel
import requests

from queues import service as service
from users import service as user_service

queues_router = InferringRouter()


class userJoin(BaseModel):
    eventId: int
    userId: int
    role: str


class resultStudent(BaseModel):
    studentId: int
    result: str
    note: str = None
    updateBy: int
    eventId: int = None

class updateStatusId(BaseModel):
    userId: int
    studentId: int = None
    userStatus: str


@cbv(queues_router)
class QueueApi:
    @queues_router.post('join-event')
    async def joined_event(self, userJoin: userJoin):
        result = await service.find_Id_exist(userJoin.eventId, userJoin.userId)
        userStatus: str = "waiting"
        if not result:
            await service.join_event(userJoin.eventId, userJoin.userId, userStatus)
            role = "student"
            alluserSTD = await service.get_all_queue_by_eventId(userJoin.eventId, role)
            total_queue = len(alluserSTD)
            for i in range(total_queue):
                if userJoin.userId == alluserSTD[i]['userId']:
                    your_queue = i+1

            return {
                "status_code": status.HTTP_201_CREATED,
                "detail": "User Joined Successfully",
                "total_queue": total_queue,
                "your_queue": your_queue
            }

        elif result:
            role = "student"
            alluserSTD = await service.get_all_queue_by_eventId(userJoin.eventId, role)
            total_queue = len(alluserSTD)
            for i in range(total_queue):
                if userJoin.userId == alluserSTD[i]['userId']:
                    your_queue = i+1
            return {
                "detail": "User is Joined",
                "total_queue": total_queue,
                "your_queue": your_queue
            }
        else:
            return{
                "detail": "User is Joined"
            }

    @queues_router.post('find-event/')
    async def find_event_user_ById(self, eventId: int, userId: int):
        result = await service.find_Id_exist(eventId, userId)
        return {
            "result": result
        }

    @queues_router.get('/getResult-interview')
    async def get_result_interview(self, eventId: int):
        result = await service.get_result_Interview(eventId, role="student")
        return {
            "status_code": status.HTTP_200_OK,
            "detail": result
        }



    @queues_router.get('student-queue/{eventId}/{userId}')
    async def student_queue(self, id: int, userId: int):
        role = "student"
        result = await service.get_all_queue_by_eventId(id, role)
        total_Queue = len(result)
        your_queue = 0
        userStatus = "waiting"
        for i in range(len(result)):
            if userId == result[i]['userId']:
                your_queue = i+1

        statusSuccess = 0
        for i in range(len(result)):
            if userStatus == result[i]['userStatus']:
                statusSuccess = i+1

        return {
            "status_code": status.HTTP_200_OK,
            "detail": result,
            "total_Queue": total_Queue,
            "your_queue": your_queue,
            "statusSuccess": statusSuccess
        }

    @queues_router.post('/update-userStatus', status_code=200)
    async def update_userStatus(self, updateStatusId: updateStatusId):
        updateStatusBy = updateStatusId.userId
        await service.update_userStatus_interview(updateStatusId.userId, updateStatusId.userStatus, updateStatusBy)
        await service.update_userStatus_interview(updateStatusId.studentId, updateStatusId.userStatus, updateStatusBy)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Status user Update Successfully"
        }
    
    @queues_router.post('/update-teacherStatus', status_code=200)
    async def update_userStatus_waiting(self, updateStatusId: updateStatusId):
        userStatus = "waiting"
        updateStatusBy = updateStatusId.userId = None
        await service.update_userStatus_interview(updateStatusId.userId, userStatus, updateStatusBy)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Status user Update Successfully"
        }

    @queues_router.post('/updateResult-student', status_code=200)
    async def update_result_student(self, resultStudent: resultStudent):
        userStatus = "success"
        await service.update_result_userstatus(resultStudent.studentId, userStatus, resultStudent.result, resultStudent.note, resultStudent.updateBy)

        updateStatus = "waiting"
        await service.update_userStatus_interview(resultStudent.updateBy, updateStatus, resultStudent.updateBy)

        #Line Notify 
        std_Role = "student"
        eventId = resultStudent.eventId

        waiting_Status = "waiting"
        waiting_std = await service.get_current_queue(std_Role, waiting_Status, eventId)
        
        if len(waiting_std) >= 3:
            remind = await user_service.alert_user(waiting_std[2]["userId"])
            if remind['lineNotify']:
                url = 'https://notify-api.line.me/api/notify'
                headers = {'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer '+remind['lineNotify']}
                msg = 'คุณ ' + remind['username']+' '+ 'ใกล้ถึงคิวของคุณแล้วกรุณาเตรียมพร้อม !!!'
                requests.post(url, headers=headers, data={'message': msg})

        elif len(waiting_std) != 0 :
            alert = await user_service.alert_user(waiting_std[0]["userId"])
            if alert['lineNotify']:
                url = 'https://notify-api.line.me/api/notify'
                headers = {'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer '+alert['lineNotify']}
                msg = 'คุณ ' + alert['username']+' '+ 'ถึงคิวของคุณแล้ว ขอให้โชคดี ==> Goodluck <3'
                requests.post(url, headers=headers, data={'message': msg})
                    



        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Successfully"
        }

    @queues_router.post('delete-user-from-event')
    async def delete_user_from_event(self, userId: int = Form(...)):
        await service.delete_users_from_queue(userId)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "User Deleted successfully"
        }



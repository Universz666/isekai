from datetime import datetime
from fastapi import HTTPException, status, Form, WebSocket
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from pydantic import BaseModel

from queues import service as service

queues_router = InferringRouter()


class userJoin(BaseModel):
    eventId: int
    userId: int
    role: str


class resultStudent(BaseModel):
    studentId: int
    result: str
    note: str


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

    # @queues_router.get('/join-event/{eventId}/{userId}')
    # async def join_event(self, eventId:int, userId:int, request: Request):
    #     userStatus = "waiting"
    #     client_host = request.client.host
    #     result = await service.find_Id_exist(eventId, userId)
    #     if not result:
    #         await service.join_event(eventId, userId, userStatus)
    #         role = "student"
    #         alluserSTD = await service.get_all_queue_by_eventId(eventId, role)
    #         total_queue = len(alluserSTD)
    #         for i in range(total_queue):
    #             if userId == alluserSTD[i]['userId']:
    #                 your_queue = i+1

    #         return {
    #             "client_host": client_host,
    #             "detail": "User Joined Successfully",
    #             "total_queue": total_queue,
    #             "your_queue": your_queue
    #         }

    #     else:
    #         role = "student"
    #         alluserSTD = await service.get_all_queue_by_eventId(eventId, role)
    #         total_queue = len(alluserSTD)
    #         for i in range(total_queue):
    #             if userId == alluserSTD[i]['userId']:
    #                 your_queue = i+1
    #         return {
    #             "client_host": client_host,
    #             "detail": "User is Joined",
    #             "total_queue": total_queue,
    #             "your_queue": your_queue
    #         }

    @queues_router.post('find-event/')
    async def find_event_user_ById(self, eventId: int, userId: int):
        result = await service.find_Id_exist(eventId, userId)
        return {
            "result": result
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
    async def update_userStatus_interview(self, userId: int = Form(...)):
        userStatus = "interviewing"
        await service.update_userStatus_interview(userId, userStatus)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Status user Update Successfully"
        }

    @queues_router.post('/updateResult-student', status_code=200)
    async def update_result_student(self, resultStudent: resultStudent):
        userStatus = "success"
        await service.update_result_userstatus(resultStudent.studentId, userStatus, resultStudent.result, resultStudent.note)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "Student interview Successfully"
        }

    @queues_router.post('delete-user-from-event')
    async def delete_user_from_event(self, userId: int = Form(...)):
        await service.delete_users_from_queue(userId)
        return {
            "status_code": status.HTTP_200_OK,
            "detail": "User Deleted successfully"
        }



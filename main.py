from multiprocessing.connection import wait
from tracemalloc import stop
from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime



from utils.dbUtil import database


from queues.api import queues_router
from users.api import user_router
from events.api import event_router

from portfoliofile.api import files_router

from queues import service as queue_service
from users import service as user_service


app = FastAPI(
    docs_url='/docs',
    redoc_url='/redocs',
    title='QMANAGEMENT-API',
    version='1.0',
    openapi_url='/openapi.json'
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ADD ROUTERS

v1_router = APIRouter(prefix="/api/v1")
v1_router.include_router(queues_router, tags=["Queues"])
v1_router.include_router(user_router, tags=["Users"])
v1_router.include_router(event_router, tags=["Events"])

v1_router.include_router(files_router, tags=["Files"])
app.include_router(v1_router)



@app.on_event('startup')
async def startup():
    await database.connect()
    print('DB is Connect!')


@app.on_event('shutdown')
async def shutdown():
    await database.disconnect()
    print('DB is Disconnect!')



@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    print('Accepting client connection...')
    await websocket.accept()
    while True:
        clientData = await websocket.receive_json()
        # print(userData["userId"])

        #All Queue
        eventId = clientData["eventId"]
        userId = clientData["userId"]

        role = "student"
        allstd_user = await queue_service.get_all_queue_by_eventId(eventId, role)
        total_queue = len(allstd_user)
        

        #studen Queue
        std_queue = 0
        for i in range(total_queue):
            if userId == allstd_user[i]["userId"]:
                std_queue = std_queue + (i+1)
                break


        #current Queue
        userStatus = "interviewing"
        current_std = await queue_service.get_current_queue(role, userStatus, eventId)
        current_queue = 0
        if len(current_std) != 0:
            for i in range(total_queue):
                if current_std[-1]["userId"] == allstd_user[i]["userId"]:
                    queue = i+1
                    current_queue = current_queue+queue
        


        #Check Status
        userData = await queue_service.get_userData(eventId, userId)
        clientStatus = userData[0]["userStatus"]
  
        if clientStatus == "waiting":
            data_queue = {"total_queue":total_queue, "current_queue":current_queue,"std_queue":std_queue,"status":clientStatus}
            await websocket.send_json(data_queue)
        
        elif clientStatus == "interviewing":
            teacherId = userData[0]["updateStatusBy"]
            teacherData = await user_service.find_teacher_byId(teacherId)
      
            data_queue = {"total_queue":total_queue,
                         "current_queue":current_queue,
                         "std_queue":std_queue,
                         "status":clientStatus,
                         "teacher_Name":teacherData["fullName"],
                         "description":teacherData["description"]}
            await websocket.send_json(data_queue)
            
        
        elif clientStatus == "success":
            data_queue = {"total_queue":total_queue, "current_queue":current_queue,"std_queue":std_queue,"status":clientStatus, "message":"สัมภาษณ์เสร็จแล้ว"}
            await websocket.send_json(data_queue)
                

@app.websocket('/ws/matchup')
async def websocket_matchup(websocket: WebSocket):
    print('Accepting')
    await websocket.accept()
    while True:
        cleintData = await websocket.receive_json()
        
        #Get all std
        eventId = cleintData["eventId"]
        role = "student"
        allstd_user = await queue_service.get_all_queue_by_eventId(eventId, role)
        total_std = len(allstd_user)
        
        #Get all std status = waiting
        userStatus = "waiting"
        std_waiting = await queue_service.get_current_queue(role, userStatus, eventId)
        std_curren_queue = 0
        if len(std_waiting) != 0:
            for i in range(total_std):
                if std_waiting[0]["userId"] == allstd_user[i]["userId"]:
                    std_curren_queue = std_curren_queue + (i+1)
                    break
            
        #Teacher and Student change status
        # interviewing = "interviewing"
        teacherId = cleintData["userId"]
        teacherStatus = await queue_service.get_userData(eventId, teacherId)

        if len(std_waiting) != 0:
            std_data = await user_service.find_std_byId(std_waiting[0]["userId"])
            stdJSON = {"stdQueue":std_curren_queue,
                        "stdId":std_waiting[0]["userId"],
                        "fullName":std_waiting[0]["fullName"],
                        "phoneNumber":std_waiting[0]["phone"],
                        "school":std_data["school"],
                        "province":std_data["province"],
                        "file":std_data["file"]}
            if teacherStatus[0]["userStatus"] == "waiting":
                await websocket.send_json(stdJSON)
            
            else:
                teacherStatus = {"teacherStatus":teacherStatus[0]["userStatus"]}
                await websocket.send_json(teacherStatus)

        else :
            outOfqueue = {"outofqueue" : "ไม่มีคิว"}
            await websocket.send_json(outOfqueue)        
    

            # await queue_service.update_userStatus_interview(teacherId, interviewing)
            # await queue_service.update_userStatus_interview(std_waiting[0]["userId"], interviewing)









if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000,
                reload=True, workers=5, log_level="info")

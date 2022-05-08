from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
from datetime import datetime
import json


from utils.dbUtil import database


from queues.api import queues_router
from users.api import user_router
from events.api import event_router

from portfoliofile.api import files_router


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


# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)


# manager = ConnectionManager()


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
        data = await websocket.receive_text()
        print(data)
        await websocket.send_text(f"Message text was : {data}")


# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, client_id: int):
#     await manager.connect(websocket)
#     now = datetime.now()
#     current_time = now.strftime("%H:%M")
#     try:
#         while True:
#             data = await websocket.receive_text()
#             # await manager.send_personal_message(f"You wrote: {data}", websocket)
#             message = {"time":current_time,"clientId":client_id,"message":data}
#             await manager.broadcast(json.dumps(message))

#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         message = {"time":current_time,"clientId":client_id,"message":"Offline"}
#         await manager.broadcast(json.dumps(message))


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000,
                reload=True, workers=5, log_level="info")

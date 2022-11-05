from urllib import response
from fastapi import HTTPException, status
from fastapi_utils.cbv import cbv
from fastapi.responses import FileResponse
from fastapi_utils.inferring_router import InferringRouter
import os
from fastapi.middleware.cors import CORSMiddleware

files_router = InferringRouter()

FILEDIR = "./portfoliofile/portfiles/"


@cbv(files_router)
class filesApi:
    @files_router.get("/portfiles/{filename}")
    async def read_random_file(self, filename):
        try:
            if os.path.isfile(FILEDIR+filename):
                files = os.path.join(FILEDIR, filename)
                return "Hello world"
        except:
            raise HTTPException(status_code=400, detail="ไม่มีไฟล์")
        else:
            raise HTTPException(status_code=400, detail="ไม่มีไฟล์")


    @files_router.get('/', response_class=FileResponse)
    async def getFile(self, filename):
        return FileResponse(FILEDIR+filename)
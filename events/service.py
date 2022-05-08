from utils.dbUtil import database

def create_event_interview(title, faculty, major, startDate, CreateByUserID, requrl):
    query = "INSERT INTO eventInterview(title, faculty, major, startDate, CreateByUserID, requrl) VALUES('{}','{}','{}','{}',{},'{}')".format(
        title, faculty, major, startDate, CreateByUserID, requrl
    )
    return database.execute(query)

def update_event_interview(title, faculty, major, startDate, CreateByUserID, id):
    query = f"UPDATE eventInterview SET title='{title}', faculty='{faculty}', major='{major}', startDate='{startDate}', CreateByUserID='{CreateByUserID}' WHERE id={id}"
    return database.execute(query)

def getEventInterview():
    quey = "SELECT * FROM eventInterview"
    return database.fetch_all(quey)

def get_EventById(requrl):
    query = f"SELECT * FROM eventInterview WHERE requrl = '{requrl}'"
    return database.fetch_one(query)

def del_event(id):
    query = f"DELETE FROM eventInterview WHERE id = {id}"
    return database.execute(query)
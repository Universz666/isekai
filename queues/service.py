from pymysql import NULL
from utils.dbUtil import database

def join_event(eventId, userId, userStatus):
    query = f"INSERT INTO resultInterview (result, note) VALUES({NULL},{NULL}); INSERT INTO joinEvent(resultId, eventId, userId, userStatus) VALUES( LAST_INSERT_ID(),{eventId},{userId},'{userStatus}')"
    return database.execute(query)

def find_Id_exist(eventId, userId):
    query = f"SELECT * FROM joinEvent WHERE eventId={eventId} AND userId={userId}"
    return database.fetch_one(query)

def get_all_queue_by_eventId(eventId, role):
    query = f"SELECT * FROM joinEvent LEFT JOIN eventInterview ON joinEvent.eventId = eventInterview.id LEFT JOIN users ON joinEvent.userId = users.id WHERE eventId = {eventId} AND users.role ='{role}' ORDER BY joinEvent.id ASC"
    return database.fetch_all(query)

def find_user_role(userId):
    query = f"SELECT role FROM users WHERE id={userId}"
    return database.fetch_one(query)

def update_userStatus_interview(userId, userStatus):
    query = f"UPDATE joinEvent SET userStatus = '{userStatus}' WHERE userID = {userId}"
    return database.execute(query)

def update_result_userstatus(userId, userStatus, result, note):
    query = f"UPDATE joinEvent LEFT JOIN resultInterview ON joinEvent.resultId = resultInterview.id SET userStatus='{userStatus}', result ='{result}', note='{note}' WHERE userId = {userId}"
    return database.execute(query)

def delete_users_from_queue(userId):
    query = f"DELETE joinEvent, resultInterview FROM joinEvent INNER JOIN resultInterview ON joinEvent.resultId = resultInterview.id WHERE joinEvent.userId = {userId}"
    return database.execute(query)
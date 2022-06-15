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

def get_userData(eventId, userId):
    query = f"SELECT * FROM joinEvent LEFT JOIN eventInterview ON joinEvent.eventId = eventInterview.id LEFT JOIN users ON joinEvent.userId = users.id WHERE eventId = {eventId} AND users.id ={userId} ORDER BY joinEvent.id ASC"
    return database.fetch_all(query)


def get_current_queue(role, userStatus, eventId):
    query = f"SELECT * FROM joinEvent LEFT JOIN eventInterview ON joinEvent.eventId = eventInterview.id LEFT JOIN users ON joinEvent.userId = users.id WHERE users.role = '{role}' AND userStatus = '{userStatus}' AND eventId = {eventId} ORDER BY joinEvent.id ASC"
    return database.fetch_all(query)

def get_result_Interview(eventId, role):
    query = f"SELECT * FROM joinEvent LEFT JOIN eventInterview ON joinEvent.eventId = eventInterview.id LEFT JOIN (SELECT users.id,users.role, users.email, users.fullName, studentInfo.id AS std_id, studentInfo.school, studentInfo.province FROM users LEFT JOIN studentInfo ON studentInfo.userId = users.id)as uu ON joinEvent.userId = uu.id LEFT JOIN (SELECT resultInterview.id as id, result, note, users.fullName AS updateBy FROM resultInterview LEFT JOIN users ON resultInterview.updateBy = users.id WHERE resultInterview.updateBy IS NOT NULL) AS r ON joinEvent.resultId = r.id WHERE eventId = {eventId} AND uu.role ='{role}' ORDER BY joinEvent.id ASC"
    return database.fetch_all(query)

def find_user_role(userId):
    query = f"SELECT role FROM users WHERE id={userId}"
    return database.fetch_one(query)

def update_userStatus_interview(userId, userStatus, updateStatusBy):
    query = f"UPDATE joinEvent SET userStatus = '{userStatus}', updateStatusBy = {updateStatusBy} WHERE userID = {userId}"
    return database.execute(query)

def update_result_userstatus(userId, userStatus, result, note, updateBy):
    query = f"UPDATE joinEvent LEFT JOIN resultInterview ON joinEvent.resultId = resultInterview.id SET userStatus='{userStatus}', result ='{result}', note='{note}', updateBy = {updateBy} WHERE userId = {userId}"
    return database.execute(query)

def delete_users_from_queue(userId):
    query = f"DELETE joinEvent, resultInterview FROM joinEvent INNER JOIN resultInterview ON joinEvent.resultId = resultInterview.id WHERE joinEvent.userId = {userId}"
    return database.execute(query)
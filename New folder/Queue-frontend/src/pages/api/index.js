import axios from "axios";

export function Login(data) {
  return axios
    .post("http://localhost:8000/api/v1/login_email", data)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function AuthLogin(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/loginUser", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function create_Event(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/createEvents", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function register_Users(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/register", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function join_Event(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1join-event", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function result_Interview(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/updateResult-student", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function update_status(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/update-userStatus", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function status_teacher_wait(teacherId) {
  return axios
    .post("http://localhost:8000/api/v1/update-teacherStatus", teacherId)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function update_data(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/update-user", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function update_role(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/updata_role", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

export function delete_user(payLoad) {
  return axios
    .post("http://localhost:8000/api/v1/delete_user", payLoad)
    .then((respone) => respone)
    .catch((error) => console.log(error));
}

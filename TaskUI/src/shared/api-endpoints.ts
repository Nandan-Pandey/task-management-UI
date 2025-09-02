import { use } from 'react';
import { environment } from '../environments/environment';

const OAUTH_USER_URL: any = environment.OAUTH_USER_URL;
const TASK_USER_URL: any = environment.TASK_URL;


const API_URL = {
	OAUTH_USER: OAUTH_USER_URL,
	TASK: TASK_USER_URL,
	
} 

export const API_ENDPOINTS = {
	//#region OAuth & Users
	USER_LOGIN: `${API_URL.OAUTH_USER}/login`,
    GetAlLTASK: `${API_URL.TASK}/allTasks`,
	TASKBYID: `${API_URL.TASK}`,
	CREATETASK: `${API_URL.TASK}/createTask`,
	USERDATA:`${API_URL.OAUTH_USER}/userMaster`,
	ASSIGNEUSER:`${API_URL.TASK}/assign`,
	STORY:`${API_URL.TASK}/AI/story`,
	SUBTASK:`${API_URL.TASK}/AI/subtask`,
	EDITTASK:`${API_URL.TASK}/updateTask/`,
	DELETETASK:`${API_URL.TASK}`
	//#endregion  OAuth & Users

	
};

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
    GetAlLTASK: `${API_URL.TASK}/Alltasks`,
	TASKBYID: `${API_URL.TASK}`
	//#endregion  OAuth & Users

	
};

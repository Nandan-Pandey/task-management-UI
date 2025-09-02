import { combineReducers } from 'redux';
import LoginUserSlice from './features/auth/UserLogin';
import getAllTaskSlice from './features/task/getAllTask';
import TaskIDSlice from './features/task/taskById';
import CreateTaskSlice from './features/task/createTask';
import UserDataSlice from './features/task/userMaster';
import assignUserSlice from './features/task/assignUser';
import AiStorySlice from './features/task/story';
import AiSubTaskSlice from './features/task/SubTask';


export default combineReducers({
	
	auth: LoginUserSlice,
	AllTask:getAllTaskSlice,
	TaskID:TaskIDSlice,
	CreateTask:CreateTaskSlice,
	UserData:UserDataSlice,
	assignUser:assignUserSlice,
	AiStory:AiStorySlice,
	AiSubTask:AiSubTaskSlice
});

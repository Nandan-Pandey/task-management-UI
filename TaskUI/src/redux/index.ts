import { combineReducers } from 'redux';
import LoginUserSlice from './features/auth/UserLogin';
import getAllTaskSlice from './features/task/getAllTask';
import TaskIDSlice from './features/task/taskById';


export default combineReducers({
	
	auth: LoginUserSlice,
	AllTask:getAllTaskSlice,
	TaskID:TaskIDSlice
});

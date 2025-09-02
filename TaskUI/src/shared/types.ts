
import dayjs from 'dayjs';
export interface subtasks {
  _id?: string;
  title: string;
  description: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  assignees: string[];
  status: 'To Do' | 'In Progress' | 'Done';
  storyPoints?: number;
}

export interface EditFormData {
  title: string;
  description: string;
  dueDate: dayjs.Dayjs | null;
  priority: string;
  status: string;
  storyPoints: number;
  assignees: string[];
  subtasks: subtasks[];
  comments: Comment[];
}

export interface StatusHistoryItem {
  from: string;
  to: string;
  timestamp: string;
  _id: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignees: string[];
  status: 'To Do' | 'In Progress' | 'Done';
  storyPoints: number;
  statusHistory: StatusHistoryItem[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
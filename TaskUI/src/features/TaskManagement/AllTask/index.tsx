import React, { use, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Space, List, Card, Typography, Tag } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined, FlagOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTask } from '../../../redux/features/task/getAllTask';
import type { RootState } from '../../../redux/store';
import { TaskID } from '../../../redux/features/task/taskById';
import TaskCard from '../taskCard';
import { UserData } from '../../../redux/features/task/userMaster';
const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;


interface StatusHistoryItem {
  from: string;
  to: string;
  timestamp: string;
  _id: string;
}

interface Comment {
  author: string;
  timestamp: string;
  text: string;
  _id?: string;
}

interface subtasks {
  _id?: string;
  title: string;
  description: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  assignees: string[];
  status: 'To Do' | 'In Progress' | 'Done';
  storyPoints?: number;
}

interface Task {
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

interface TaskCardData {
  task: Task;
  subtaskTitles: string[];
  subtasks?: subtasks[];
}


interface EditFormData {
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





const TaskCardContainer: React.FC = () => {
  
  const { getAllTaskRes }:any = useSelector((state: RootState) => state?.AllTask);
    const [tasks, setTasks] = useState(getAllTaskRes?.data); 
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  const dispatch=useDispatch();
   useEffect(() => {
    const fetchTasks = async () => {
      try {
        await dispatch(getAllTask());
        await dispatch(UserData());
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  useEffect(() => {
    setTasks(getAllTaskRes?.data);
  }, [getAllTaskRes]);


  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks:any )=>
      prevTasks?.map((taskData:any) =>
        taskData.task._id === updatedTask._id
          ? { ...taskData, task: updatedTask }
          : taskData
      )
    );
  };

   const handleAddTask = () => {
    setIsAddModalVisible?.(true);
    console.log("Add new task clicked");
    // Example: navigate('/add-task') or setShowAddTaskModal(true)
  };

  return (
    <div style={pageStyles}>
      {/* Header Section */}
      <div style={headerContainerStyles}>
        <div style={headerContentStyles}>
          <Title level={1} style={mainTitleStyles}>
            Task Management System
          </Title>
          <Text style={subtitleStyles}>
            Organize, track, and manage your team's tasks efficiently
          </Text>
          <Button 
              type="primary" 
              size="large"
              onClick={handleAddTask}
              className="add-task-button"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '48px',
                padding: '0 24px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'absolute',
                top: '24px',
                right: '24px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0)',
                zIndex: 1000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
            >
              <PlusOutlined 
                style={{
                  fontSize: '18px',
                  transition: 'transform 0.3s ease',
                }}
              />
              Add Task
            </Button>
          <div style={statsStyles}>
            <div style={statItemStyles}>
              <span style={statNumberStyles}>{tasks?.length}</span>
              <span style={statLabelStyles}>Total Tasks</span>
            </div>
            <div style={statItemStyles}>
              <span style={statNumberStyles}>{tasks?.filter((t:any) => t.task.status === 'Done')?.length}</span>
              <span style={statLabelStyles}>Completed</span>
            </div>
            <div style={statItemStyles}>
              <span style={statNumberStyles}>{tasks?.filter((t:any) => t.task.status === 'In Progress')?.length}</span>
              <span style={statLabelStyles}>In Progress</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tasks Grid */}
      <div style={containerStyles}>
        {tasks?.map((taskData:any) => (
          <TaskCard
            key={taskData.task._id}
            taskData={taskData}
            onTaskUpdate={handleTaskUpdate}
            setIsAddModalVisible={setIsAddModalVisible}
            isAddModalVisible={isAddModalVisible}
          />
        ))}
      </div>
    </div>
  );
};

// Styles
const pageStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative' as const,
  overflow: 'auto'
};

const headerContainerStyles = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '40px 20px',
  textAlign: 'center' as const
};

const headerContentStyles = {
  maxWidth: '1200px',
  margin: '0 auto'
};

const mainTitleStyles = {
  color: 'white',
  fontSize: '48px',
  fontWeight: 800,
  margin: '0 0 10px 0',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  letterSpacing: '-1px'
};

const subtitleStyles = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '18px',
  fontWeight: 400,
  display: 'block',
  marginBottom: '30px'
};

const statsStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginTop: '20px'
};

const statItemStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.15)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  minWidth: '100px'
};

const statNumberStyles = {
  fontSize: '32px',
  fontWeight: 700,
  color: 'white',
  lineHeight: 1
};

const statLabelStyles = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: 500,
  marginTop: '4px'
};

const containerStyles = {
  padding: '30px 20px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '24px',
  maxWidth: '1400px',
  margin: '0 auto',
  justifyItems: 'center'
};




export default TaskCardContainer;

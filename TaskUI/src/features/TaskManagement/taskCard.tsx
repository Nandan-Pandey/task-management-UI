import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Space, List, Card, Typography, Tag, message, Popconfirm, Spin } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined, FlagOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined, MailOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { TaskID } from '../../redux/features/task/taskById';
const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
import './taskcard.css';
import { CreateTask } from '../../redux/features/task/createTask';
import { getAllTask } from '../../redux/features/task/getAllTask';
import type { RootState } from '../../redux/store';
import { AiStory } from '../../redux/features/task/story';
import { AiSubTask } from '../../redux/features/task/SubTask';
import type { EditFormData, Task } from '../../shared/types';
import { EditTask } from '../../redux/features/task/editTask';
import { DeleteAPI } from '../../redux/features/task/delete';
 
 
 
 
const TaskCard: React.FC<any> = ({
  taskData,
  onTaskUpdate,
  setIsAddModalVisible,
  isAddModalVisible,
  mode = 'edit', // 'edit' or 'add'
  onTaskCreate
}) => {
  const { task, subtasks,totalStoryPoints } = taskData || {};

  const {AiSubTaskLoad } = useSelector((state: RootState) => state?.AiSubTask);
   const {AiStoryLoad } = useSelector((state: RootState) => state?.AiStory);
  const subtaskdata=subtasks;
 
  console.log(subtaskdata,task);
 
  const dispatch = useDispatch();
    const { UserDataRes }:any = useSelector((state: RootState) => state?.UserData);
 
  // Separate states for edit and add modals
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm<EditFormData>();
  const [descriptionSuggestion, setDescriptionSuggestion] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
 
  // Enhanced description suggestions based on content analysis
  const generateDescriptionSuggestion = (description: string, taskTitle: string) => {
    if (description.length < 10) {
      return `Consider expanding: "${taskTitle}" - Add specific implementation steps, acceptance criteria, and technical requirements to provide clear guidance for the assignee.`;
    } else{
   
      return `Add technical context: "${description}" → Specify technologies, frameworks, or architectural considerations relevant to this development task.`;
    }  
  };
 
  // Handle description change and suggestion generation
  const handleDescriptionChange = (e: any) => {
    const value = e.target.value;
    setCurrentDescription(value);
    editForm.setFieldsValue({ description: value });
    const taskTitle = editForm.getFieldValue('title') || '';
    const suggestion = generateDescriptionSuggestion(value, taskTitle);
    setDescriptionSuggestion(suggestion);
    setShowSuggestion(!!suggestion);
  };
 
  // Apply suggestion to description field
  const applySuggestion = async () => {
    if (descriptionSuggestion) {
   const res =await  dispatch(AiStory( {"user-story":currentDescription}))
   debugger
      setCurrentDescription(res?.payload?.data?.data?.raw);
      editForm.setFieldsValue({ description: res?.payload?.data?.data?.raw });
      setShowSuggestion(false);
      message.success('Description suggestion applied!');
    }
  };
 
  // Handle intelligent subtask addition
const addIntelligentSubtask = async () => {
  try {
    const currentSubtasks = editForm.getFieldValue('subtasks') || [];
 
    // Call your AI subtask API
    const result = await dispatch(
      AiSubTask({ subtask: editForm.getFieldValue('title') })
    );
 
    const resSubtasks = result?.payload?.data?.data?.subtasks;
 
    if (resSubtasks && resSubtasks.length > 0) {
      // Map API subtasks to form-compatible structure
      const mappedSubtasks = resSubtasks.map((subtask: any) => ({
        title: subtask.title,
        description: subtask.description,
        priority: subtask.priority,
        status: subtask.status,
        assignees: subtask.assignees || [],
        storyPoints: subtask.storyPoints,
      }));
 
      // Append new subtasks to the current form value
      editForm.setFieldsValue({
        subtasks: [...currentSubtasks, ...mappedSubtasks],
      });
 
      message.success('Intelligent subtask generated and added!');
    } else {
      message.warning('No subtasks returned from AI.');
    }
  } catch (error) {
    console.error(error);
    message.error('Failed to generate intelligent subtask.');
  }
};
 


const handleDelete = async (taskId: string) => {
 const res =await dispatch(DeleteAPI(taskId))
 
  if( res?.payload?.status===200){ 
    message.success('Task deleted successfully!');
  await  dispatch(getAllTask()); 
  }
   
};
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
 
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#f59e0b';
    }
  };
 
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do': return '#6b7280';
      case 'in progress': return '#3b82f6';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };
 
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do': return <ExclamationCircleOutlined />;
      case 'in progress': return <ClockCircleOutlined />;
      case 'done': return <CheckCircleOutlined />;
      default: return <ExclamationCircleOutlined />;
    }
  };
 
  // Handle Edit Modal (for editing assignees only)
const handleEditClick = async () => {
  if (task) {
    const res = await dispatch(TaskID(task._id));
 
    if (res?.payload?.data) {
      const data = res.payload.data;
 
      // Map subtasks to form format
      const mappedSubtasks = data.subtasks?.map((subtask: any) => ({
        _id: subtask._id,
        title: subtask.title,
        description: subtask.description,
        dueDate: subtask.dueDate ? dayjs(subtask.dueDate) : null,
        priority: subtask.priority,
        assignees: subtask.assignees || [],
        status: subtask.status,
        storyPoints: subtask.storyPoints,
      }));
 
      // Set all form fields with the fetched data
      editForm.setFieldsValue({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
        priority: data.priority,
        status: data.status,
        storyPoints: data.storyPoints,
        assignees: Array.isArray(data.assignees) ? data.assignees : [],
        subtasks: mappedSubtasks || [],
      });
 
      // Set current description for the suggestion system
      setCurrentDescription(data.description || '');
    }
  }
  setIsEditModalVisible(true);
};
 
  // Handle Add Modal (for creating new tasks)
  const handleAddClick = () => {
    // Set default values for add mode
    editForm.setFieldsValue({
      title: '',
      description: '',
      dueDate: dayjs().add(7, 'days'),
      priority: 'Medium',
      status: 'To Do',
      storyPoints: 1,
      assignees: [],
      subtasks: [],
      comments: []
    });
    setCurrentDescription('');
    setShowSuggestion(false);
    setIsAddModalVisible?.(true);
  };
 
  // Handle Cancel for Edit Modal
  const handleEditCancel = () => {
     setCurrentDescription("");
    setIsEditModalVisible(false);
    editForm.resetFields();
  };
 
  // Handle Cancel for Add Modal
  const handleAddCancel = () => {
    setIsAddModalVisible?.(false);
    setShowSuggestion(false);
    setDescriptionSuggestion("");
    setCurrentDescription("");
    editForm.resetFields();
  };
 
  // Handle Submit for Edit Modal (assignees only)
 
const handleEditSubmit = async () => {
  if (task) {

   const taskdata =await editForm.validateFields()
    const res = await dispatch(EditTask({ id: task._id, payload:  taskdata }));
    debugger
    if (res?.payload?.data) {
      const data = res.payload.data;
 
      // Map subtasks to form format
      const mappedSubtasks = data.subtasks?.map((subtask: any) => ({
       
        assignees: subtask.assignees || [],
        status: subtask.status,
      
      }));

    const result=  await dispatch(EditTask({ id: task._id, payload:  taskdata }));

     if(result?.payload?.data && result?.payload?.status===200){
      message.success('Task updated successfully!');
      await dispatch(getAllTask());
      handleEditCancel();
     }

      editForm.setFieldsValue({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
        priority: data.priority,
        status: data.status,
        storyPoints: data.storyPoints,
        assignees: Array.isArray(data.assignees) ? data.assignees : [],
        subtasks: mappedSubtasks || [],
      });
    }
  }
  setIsEditModalVisible(true);
};
 
  // Handle Submit for Add Modal (full task creation)
  const handleAddSubmit = async () => {
    try {
      const values = await editForm.validateFields();
     
      // Prepare data for task creation
      const newTaskData = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        priority: values.priority,
        assignees: values.assignees,
        status: values.status,
        storyPoints: values.storyPoints,
        subtasks: values.subtasks?.map((subtask: any) => ({
          title: subtask.title,
          description: subtask.description,
          dueDate: subtask.dueDate ? subtask.dueDate.toISOString() : null,
          priority: subtask.priority,
          assignees: subtask.assignees,
          status: subtask.status,
          storyPoints: subtask.storyPoints
        })) || []
      };
 
     
     const res= await dispatch(CreateTask(newTaskData));
debugger
      if (res?.payload?.data && res?.payload?.status === 201  ) {
       dispatch(getAllTask());
      message.success('Task created successfully!');
      setIsAddModalVisible?.(false);}
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error('Please fill in all required fields');
    }
  };
 
  // Only render task card if we have task data (edit mode)
 
    return (
      <>
        <div className="task-card">
          <div className="task-card-header">
            <div className="task-meta">
              <div className="task-card-tags">
                <Tag color={getPriorityColor(task.priority)} className="task-card-priority-tag">
                  <FlagOutlined />
                  {task.priority}
                </Tag>
                <Tag color={getStatusColor(task.status)} className="task-card-status-tag">
                  {getStatusIcon(task.status)}
                  <span>{task.status}</span>
                </Tag>
              </div>
            </div>
            <div className="task-card-story-points">
              <span className="sp-label">SP</span>
              <span className="sp-label">{''}</span>
              <span className="sp-value">
  {totalStoryPoints}
</span>
 
            </div>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              className="task-card-edit-btn"
              size="small"
            />
          </div>
                 <Popconfirm
        title="Are you sure to delete this task?"
        onConfirm={() => handleDelete(task._id)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          className="task-card-delete-btn"
          size="small"
        />
      </Popconfirm>

          <div className="task-content">
            <h3 className="task-card-title">{task.title}</h3>
            <p className="task-card-description">{task.description}</p>
          </div>
         
          <div className="task-details">
            <div className="task-detail-row">
              <span className="task-detail-label">
                <CalendarOutlined />
                Due:
              </span>
              <span className="task-detail-value">{formatDate(task?.dueDate)}</span>
            </div>
            <div className="task-detail-row">
              <span className="task-detail-label">ID:</span>
              <span className="task-card-id">{task._id.slice(-8)}</span>
            </div>
          </div>
         
          {subtaskdata?.length > 0 && (
           
            <div className="subtasks-section">
              <h4 className="subtasks-title">Subtasks ({subtaskdata?.length}):</h4>
              <ul className="subtasks-list">
                {subtaskdata.slice(0, 2)?.map((subtask: any, index: any) => (
                  <li key={index} className="subtask-item">
                    <span className="subtask-bullet">•</span>
                    {subtask?.length > 25 ? `${subtask.substring(0, 25)}...` : subtask?.title}
                  </li>
                ))}
                {subtaskdata?.length > 2 && (
                  <li className="subtask-item">
                    <span className="subtask-bullet">•</span>
                    +{subtaskdata?.length - 2} more...
                  </li>
                )}
              </ul>
            </div>
          )}
         
          <div className="task-footer">
            <div className="task-assignees">
              <UserOutlined />
              <span className="assignees-count">
                {task.assignees?.length} assigned
              </span>
            </div>
            <div className="task-last-updated">
              {formatDate(task.updatedAt)}
            </div>
          </div>
        </div>
 
     <Modal
  title={
    <div className="modal-title">
      <EditOutlined />
      <span>Edit Task</span>
    </div>
  }
  open={isEditModalVisible}
  onCancel={handleEditCancel}
  width={800}
  footer={[
    <Button key="cancel" onClick={handleEditCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleEditSubmit}>
      Save Changes
    </Button>,
  ]}
  destroyOnClose
>
  <Form form={editForm} layout="vertical" className="task-form">
  
   
 
  
    <div className="form-row">
    
      <Form.Item
        name="status"
        label="Status"
        className="form-item-flex"
        rules={[{ required: true, message: "Please select status" }]}
      >
        <Select placeholder="Select status">
          <Option value="To Do">To Do</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
          <Option value="Blocked">Blocked</Option>
        </Select>
      </Form.Item>
    </div>
 
  
 
    <Form.Item
      name="assignees"
      label="Assignees"
      rules={[{ required: true, message: "Please select assignees" }]}
    >
      <Select mode="multiple" placeholder="Select assignees">
        {UserDataRes?.data?.map((user: any) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
 
    {/* Subtasks */}
    <Form.List name="subtasks">
      {(fields) => (
        <Card
          title={
            <div className="card-header">
              <span>Subtasks</span>
             
            </div>
          }
          size="small"
          className="subtasks-card"
        >
          {fields.map(({ key, name, ...restField }) => (
            <Card
              key={key}
              size="small"
              className="subtask-card"
              title={
                <div className="subtask-header">
                  <Text strong>Subtask #{name + 1}</Text>
                 
                </div>
              }
            >
            
             
              
             
              <div className="form-row">
               
               
                <Form.Item
                  {...restField}
                  name={[name, "status"]}
                  label="Status"
                  className="form-item-flex"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select placeholder="Select status" size="small">
                    <Option value="To Do">To Do</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Done">Done</Option>
                    <Option value="Blocked">Blocked</Option>
                  </Select>
                </Form.Item>
              </div>
             
              <div className="form-row">
              
               
             
              </div>
             
              <Form.Item
                {...restField}
                name={[name, "assignees"]}
                label="Assignees"
                rules={[{ required: true, message: "Please select assignees" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select assignees"
                  size="small"
                  optionFilterProp="children"
                >
                  {UserDataRes?.data?.map((user: any) => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          ))}
          {fields.length === 0 && (
            <div className="empty-state">No subtasks found for this task.</div>
          )}
        </Card>
      )}
    </Form.List>
  </Form>
</Modal>
 
 
        <Modal
          mask={false}  
        title={
           <div className="modal-title">
            <PlusOutlined />
            <span>Create New Task</span>
          </div>
        }
        open={isAddModalVisible}
        onCancel={handleAddCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleAddCancel}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAddSubmit}>Create Task</Button>,
        ]}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" className="task-form">
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
         
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <div className="description-input-wrapper">
              <TextArea
                rows={4}
                placeholder="Enter task description"
                onChange={handleDescriptionChange}
                value={currentDescription}
              />
              {showSuggestion && (
                <div
                  className="suggestion-icon"
                  title="Apply suggested improvement"
                  onClick={()=>applySuggestion()}
                >
                 {AiStoryLoad?<Spin/>:<MailOutlined />} 
                </div>
              )}
            </div>
          </Form.Item>
         
          {showSuggestion && (
            <div className="suggestion-box">
              💡 <strong>AI Suggestion:</strong> {descriptionSuggestion}
            </div>
          )}
 
          <div className="form-row">
            <Form.Item name="priority" label="Priority" className="form-item-flex">
              <Select placeholder="Select priority">
                <Option value="High">
                  <FlagOutlined /> High
                </Option>
                <Option value="Medium">
                  <FlagOutlined /> Medium
                </Option>
                <Option value="Low">
                  <FlagOutlined /> Low
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              className="form-item-flex"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="To Do">To Do</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
              </Select>
            </Form.Item>
          </div>
         
          <div className="form-row">
            <Form.Item name="dueDate" label="Due Date" className="form-item-flex">
              <DatePicker
                className="full-width"
                placeholder="Select due date"
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item
              name="storyPoints"
              label="Story Points"
              className="form-item-flex"
            >
              <InputNumber
                min={0}
                max={100}
                className="full-width"
                placeholder="Enter story points"
              />
            </Form.Item>
          </div>
         
          <Form.Item
  name="assignees"
  label="Assignees"
  rules={[{ required: true, message: "Please select assignees" }]}
>
  <Select
    mode="multiple"
    placeholder="Select assignees"
    optionFilterProp="children"
  >
    {UserDataRes?.data?.map((user: any) => (
      <Select.Option key={user.id} value={user.id}>
        {user.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
         
          <Form.List name="subtasks">
            {(fields, { add, remove }) => (
              <Card
                title={
                  <div className="card-header">
                    <span>Subtasks</span>
                    <div>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => add()}
                        className="add-btn"
                      >
                        Add Subtask
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        onClick={addIntelligentSubtask}
                        className="smart-generate-btn"
                      >
                       {AiSubTaskLoad? <Spin/>:'🤖 Smart Generate'}
                      </Button>
                    </div>
                  </div>
                }
                size="small"
                className="subtasks-card"
              >
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    className="subtask-card"
                    title={
                      <div className="subtask-header">
                        <Text strong>Subtask #{name + 1}</Text>
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      </div>
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      label="Subtask Title"
                      rules={[{ required: true, message: "Please enter subtask title" }]}
                    >
                      <Input placeholder="Enter subtask title" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Description"
                      rules={[{ required: true, message: "Please enter subtask description" }]}
                    >
                      <TextArea rows={2} placeholder="Enter subtask description" />
                    </Form.Item>
                    <div className="form-row">
                      <Form.Item
                        {...restField}
                        name={[name, "priority"]}
                        label="Priority"
                        className="form-item-flex"
                      >
                        <Select placeholder="Select priority" size="small">
                          <Option value="High">High</Option>
                          <Option value="Medium">Medium</Option>
                          <Option value="Low">Low</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "status"]}
                        label="Status"
                        className="form-item-flex"
                        rules={[{ required: true, message: "Please select status" }]}
                      >
                        <Select placeholder="Select status" size="small">
                          <Option value="To Do">To Do</Option>
                          <Option value="In Progress">In Progress</Option>
                          <Option value="Done">Done</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="form-row">
                      <Form.Item
                        {...restField}
                        name={[name, "dueDate"]}
                        label="Due Date"
                        className="form-item-flex"
                      >
                        <DatePicker
                          className="full-width"
                          placeholder="Select due date"
                          format="YYYY-MM-DD"
                          size="small"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "storyPoints"]}
                        label="Story Points"
                        className="form-item-flex"
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          className="full-width"
                          placeholder="Enter story points"
                          size="small"
                        />
                      </Form.Item>
                    </div>
                  <Form.Item
  {...restField}
  name={[name, "assignees"]}
  label="Assignees"
  rules={[{ required: true, message: "Please select assignees" }]}
>
  <Select
    mode="multiple"
    placeholder="Select assignees"
    size="small"
    optionFilterProp="children"
    filterOption={(input, option) =>
      (option?.children as unknown as string)
        .toLowerCase()
        .includes(input.toLowerCase())
    }
  >
    {UserDataRes?.data?.map((user: { id: string; name: string }) => (
      <Select.Option key={user.id} value={user.id}>
        {user.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
 
                  </Card>
                ))}
                {fields?.length === 0 && (
                  <div className="empty-state">
                    No subtasks yet. Click "Add Subtask" or "🤖 Smart Generate" to create one.
                  </div>
                )}

                <div className="comments-section">
                <div className="comments-header">
               <h4 className="comments-title">Comments</h4>
                 <Button
      type="primary"
      size="small"
      icon={<PlusOutlined />}
      // onClick={handleAddComment}
      className="add-comment-btn"
    >
      Add Comment
    </Button>
  </div>
  </div>

  <Form.Item name="comments" style={{ display: 'none' }}>
    <Input />
  </Form.Item>
              </Card>

              
            )}
          </Form.List>
        </Form>
      </Modal>
      </>
    );
 
 
};
 
export default TaskCard;
 

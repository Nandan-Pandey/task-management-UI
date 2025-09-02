import React, { use, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Space, List, Card, Typography, Tag } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined, FlagOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { TaskID } from '../../redux/features/task/taskById';
import {  MailOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;


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
interface StatusHistoryItem {
  from: string;
  to: string;
  timestamp: string;
  _id: string;
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


const TaskCard: React.FC<any> = ({ taskData, onTaskUpdate,setIsEditModalVisible,isEditModalVisible }) => {
  const { task, subtaskTitles } = taskData;
  const dispatch =useDispatch();
  console.log('taskData in TaskCard:', taskData);
  
 
  const [editForm] = Form.useForm<EditFormData>();

  // Format date as MM/DD/YYYY
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



  const handleEditClick = async () => {
  const res = await dispatch(TaskID(task._id));

  if (res?.payload?.data) {
    const data = res.payload.data;
  const subtasks = Array.isArray(data.subTask)
  ? data.subTask.map((st:any) => ({
      ...st,
      dueDate: st.dueDate ? dayjs(st.dueDate) : null,
    }))
  : [];
   editForm.setFieldsValue({
  title: data.title,
  description: data.description,
  dueDate: data.dueDate ? dayjs(data.dueDate) : null,
  priority: data.priority,
  status: data.status,
  storyPoints: data.storyPoints,
  assignees: Array.isArray(data.assignees) ? data.assignees : [],
  subtasks:subtasks,
  comments: Array.isArray(data.comments) ? data.comments : [],
});
  }

setIsEditModalVisible?.(true);;
};

  const handleEditCancel = () => {
   setIsEditModalVisible?.(false);
    editForm.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();

      // Create status history entry if status changed
      const newStatusHistory = [...task.statusHistory];
      if (values.status !== task.status) {
        newStatusHistory.push({
          from: task.status,
          to: values.status,
          timestamp: new Date().toISOString(),
          _id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      }

      const updatedTask: Task = {
        ...task,
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.toISOString() : task.dueDate,
        priority: values.priority as 'High' | 'Medium' | 'Low',
        status: values.status as 'To Do' | 'In Progress' | 'Done',
        storyPoints: values.storyPoints,
        assignees: values.assignees,
        comments: values.comments || [],
        statusHistory: newStatusHistory,
        updatedAt: new Date().toISOString()
      };

      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      setIsEditModalVisible?.(false);
      console.log('Updated task:', updatedTask);
      console.log('Updated subtasks:', values.subtasks);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  color: '#1f2937',
  transition: 'all 0.3s ease',
  position: 'relative' as const,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '320px',
  height: 'auto',
  minHeight: '300px',
  cursor: 'default',
  display: 'flex',
  flexDirection: 'column' as const
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px',
  position: 'relative' as const,
  zIndex: 1,
  flexShrink: 0
};

const metaStyles = {
  flex: 1
};

const storyPointsStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  borderRadius: '10px',
  padding: '8px 12px',
  minWidth: '50px',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  color: 'white'
};

const pointsLabelStyles = {
  fontSize: '10px',
  fontWeight: 600,
  opacity: 0.9,
  lineHeight: 1
};

const pointsValueStyles = {
  fontSize: '18px',
  fontWeight: 700,
  lineHeight: 1
};

const editButtonStyles = {
  position: 'absolute' as const,
  top: '-10px',
  right: '-10px',
  color: '#667eea',
  background: 'white',
  border: '2px solid #667eea',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.2s ease'
};

const contentStyles = {
  marginBottom: '16px',
  position: 'relative' as const,
  zIndex: 1,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column' as const
};

const titleStyles = {
  fontSize: '18px',
  fontWeight: 700,
  margin: '0 0 12px 0',
  lineHeight: 1.3,
  color: '#1f2937'
};

const descriptionStyles = {
  fontSize: '14px',
  lineHeight: 1.5,
  margin: 0,
  color: '#6b7280',
  flexGrow: 1
};

const detailsStyles = {
  marginBottom: '16px',
  position: 'relative' as const,
  zIndex: 1,
  flexShrink: 0
};

const detailRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  fontSize: '13px'
};

const detailLabelStyles = {
  fontWeight: 600,
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center'
};

const detailValueStyles = {
  fontWeight: 600,
  color: '#1f2937'
};

const taskIdStyles = {
  fontFamily: "'Courier New', monospace",
  background: '#f3f4f6',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  color: '#667eea'
};

const subtasksStyles = {
  marginBottom: '16px',
  position: 'relative' as const,
  zIndex: 1,
  flexShrink: 0
};

const subtasksTitleStyles = {
  fontSize: '14px',
  fontWeight: 600,
  margin: '0 0 8px 0',
  color: '#374151'
};

const subtasksListStyles = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const subtaskItemStyles = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  marginBottom: '4px',
  color: '#6b7280'
};

const subtaskBulletStyles = {
  marginRight: '8px',
  color: '#667eea',
  fontWeight: 'bold'
};

const footerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '12px',
  fontSize: '12px',
  position: 'relative' as const,
  zIndex: 1,
  flexShrink: 0,
  marginTop: 'auto'
};
const lastUpdatedStyles = {
  color: '#9ca3af',
  fontWeight: 500,
  fontSize: '11px'
};

const assigneesStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#6b7280'
};

const assigneesCountStyles = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  padding: '4px 10px',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '11px',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
};


 const [descriptionSuggestion, setDescriptionSuggestion] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

const autoSubtaskTemplate = {
  title: "Auto-generated Subtask",
  description: "Implement the UI and validation for a login form.",
  dueDate: dayjs().add(3, "days"),
  priority: "Medium",
  assignees: [],
  status: "To Do",
  storyPoints: 2
};

const getDescriptionSuggestion = (val:any) =>
  val.length < 20
    ? "Suggestion: Consider providing a bit more detail in your task description."
    : "Suggestion: Your description looks clear.";
 const handleDescriptionChange = (e:any) => {
    setDescriptionSuggestion(getDescriptionSuggestion(e.target.value));
  };
 

  

  return (
    <>
      <div className="task-card" style={cardStyles}>
        <div className="task-card-header" style={headerStyles}>
          <div className="task-meta" style={metaStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Tag
                color={getPriorityColor(task.priority)}
                style={{ margin: 0, fontWeight: 600, fontSize: '10px' }}
              >
                <FlagOutlined style={{ marginRight: '4px' }} />
                {task.priority}
              </Tag>
              <Tag
                color={getStatusColor(task.status)}
                style={{ margin: 0, fontWeight: 600, fontSize: '10px' }}
              >
                {getStatusIcon(task.status)}
                <span style={{ marginLeft: '4px' }}>{task.status}</span>
              </Tag>
            </div>
          </div>
          <div style={storyPointsStyles}>
            <span style={pointsLabelStyles}>SP</span>
            <span style={pointsValueStyles}>{task.storyPoints}</span>
          </div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            style={editButtonStyles}
            size="small"
          />
        </div>

        <div className="task-content" style={contentStyles}>
          <h3 style={titleStyles}>{task.title}</h3>
          <p style={descriptionStyles}>{task.description}</p>
        </div>
        <div className="task-details" style={detailsStyles}>
          <div style={detailRowStyles}>
            <span style={detailLabelStyles}>
              <CalendarOutlined style={{ marginRight: '4px' }} />
              Due:
            </span>
            <span style={detailValueStyles}>{formatDate(task?.dueDate)}</span>
          </div>
          <div style={detailRowStyles}>
            <span style={detailLabelStyles}>ID:</span>
            <span style={{ ...detailValueStyles, ...taskIdStyles }}>{task._id.slice(-8)}</span>
          </div>
        </div>
        {subtaskTitles?.length > 0 && (
          <div className="subtasks-section" style={subtasksStyles}>
            <h4 style={subtasksTitleStyles}>Subtasks ({subtaskTitles?.length}):</h4>
            <ul style={subtasksListStyles}>
              {subtaskTitles.slice(0, 2)?.map((subtask:any, index:any) => (
                <li key={index} style={subtaskItemStyles}>
                  <span style={subtaskBulletStyles}>•</span>
                  {subtask?.length > 25 ? `${subtask.substring(0, 25)}...` : subtask}
                </li>
              ))}
              {subtaskTitles?.length > 2 && (
                <li style={subtaskItemStyles}>
                  <span style={subtaskBulletStyles}>•</span>
                  +{subtaskTitles?.length - 2} more...
                </li>
              )}
            </ul>
          </div>
        )}
        <div className="task-footer" style={footerStyles}>
          <div style={assigneesStyles}>
            <UserOutlined style={{ marginRight: '4px', fontSize: '12px' }} />
            <span style={assigneesCountStyles}>
              {task.assignees?.length} assigned
            </span>
          </div>
          <div style={lastUpdatedStyles}>
            {formatDate(task.updatedAt)}
          </div>
        </div>
      </div>
       <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <EditOutlined />
          <span>Edit Task</span>
        </div>
      }
      open={isEditModalVisible}
      onCancel={handleEditCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleEditCancel}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleEditSubmit}>Save Changes</Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={editForm}
        layout="vertical"
        style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}
      >
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
  <div style={{ position: 'relative' }}>
    <TextArea
      rows={4}
      placeholder="Enter task description"
      onChange={handleDescriptionChange}
      value={descriptionValue} // assuming you manage descriptionValue via useState
    />
    {descriptionSuggestion && (
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          cursor: 'pointer',
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: 6,
          border: '1px solid #dbeafe'
        }}
        title="Apply suggested improvement"
        onClick={() => setDescriptionValue(descriptionSuggestion)}
      >
        <MailOutlined style={{ color: '#3b82f6', fontSize: 18 }} />
      </div>
    )}
  </div>
</Form.Item>
{descriptionSuggestion && (
  <div style={{ color: "#3b82f6", fontSize: "13px", marginBottom: "10px" }}>
    Suggestion: {descriptionSuggestion}
  </div>
)}

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item name="priority" label="Priority" style={{ flex: 1 }}>
            <Select placeholder="Select priority">
              <Option value="High">
                <FlagOutlined style={{ color: "#ef4444" }} /> High
              </Option>
              <Option value="Medium">
                <FlagOutlined style={{ color: "#f59e0b" }} /> Medium
              </Option>
              <Option value="Low">
                <FlagOutlined style={{ color: "#22c55e" }} /> Low
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="To Do">To Do</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item name="dueDate" label="Due Date" style={{ flex: 1 }}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select due date"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            name="storyPoints"
            label="Story Points"
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Enter story points"
            />
          </Form.Item>
        </div>
        <Form.Item name="assignees" label="Assignees">
          <Input placeholder="Enter assignees (comma separated)" />
        </Form.Item>
        <Card
          title="Status History"
          size="small"
          style={{ marginBottom: "16px" }}
          bodyStyle={{ maxHeight: "150px", overflowY: "auto" }}
        >
          <List
            size="small"
            dataSource={task.statusHistory}
            renderItem={(item:any) => (
              <List.Item style={{ padding: "4px 0", border: "none" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Tag color="blue">{item.from}</Tag>
                    <span>→</span>
                    <Tag color="green">{item.to}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>
        <Form.List name="subtasks">
          {(fields, { add, remove }) => (
            <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Subtasks</span>
                  <div>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => add()} style={{ marginRight: 8 }}
                    >
                      Add Subtask
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      onClick={() => add(autoSubtaskTemplate)}
                    >
                      Auto-Generate Subtask
                    </Button>
                  </div>
                </div>
              }
              size="small"
              style={{ marginBottom: "16px" }}
              bodyStyle={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: "12px", background: "#f8f9fa" }}
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text strong style={{ fontSize: "14px" }}>
                        Subtask #{name + 1}
                      </Text>
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
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "priority"]}
                      label="Priority"
                      style={{ flex: 1 }}
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
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: "Please select status" }]}
                    >
                      <Select placeholder="Select status" size="small">
                        <Option value="To Do">To Do</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Done">Done</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "dueDate"]}
                      label="Due Date"
                      style={{ flex: 1 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Select due date"
                        format="YYYY-MM-DD"
                        size="small"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "storyPoints"]}
                      label="Story Points"
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                        placeholder="Enter story points"
                        size="small"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, "assignees"]}
                    label="Assignees"
                  >
                    <Input placeholder="Enter assignees (comma separated)" size="small" />
                  </Form.Item>
                </Card>
              ))}
              {fields?.length === 0 && (
                <div style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  No subtasks yet. Click "Add Subtask" to create one.
                </div>
              )}
            </Card>
          )}
        </Form.List>
        {/* Comments section stays unchanged */}
        <Form.List name="comments">
          {(fields, { add, remove }) => (
            <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Comments</span>
                  <Button type="dashed" onClick={() => add()} size="small">
                    Add Comment
                  </Button>
                </div>
              }
              size="small"
              bodyStyle={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {fields?.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: "12px", padding: "8px", background: "#fafafa", borderRadius: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <Text strong style={{ fontSize: "12px" }}>
                      Comment #{name + 1}
                    </Text>
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, "author"]}
                    label="Author"
                    rules={[{ required: true, message: "Please enter author" }]}
                  >
                    <Input placeholder="Author name or ID" size="small" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "text"]}
                    label="Comment"
                    rules={[{ required: true, message: "Please enter comment text" }]}
                  >
                    <TextArea rows={2} placeholder="Enter comment text" size="small" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "timestamp"]}
                    label="Timestamp"
                    initialValue={new Date().toISOString()}
                  >
                    <Input placeholder="Timestamp" size="small" disabled />
                  </Form.Item>
                </div>
              ))}
              {fields?.length === 0 && (
                <div style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                  No comments yet. Click "Add Comment" to add one.
                </div>
              )}
            </Card>
          )}
        </Form.List>
      </Form>
    </Modal>
    </>
  );


  
};

export default TaskCard;
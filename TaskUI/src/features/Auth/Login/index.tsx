import { Button, Card, Form, Input, Layout, message, Typography } from 'antd';
import React, { useEffect } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './loginPage.css';
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { LoginUser, resetLoginUser } from '../../../redux/features/auth/UserLogin';

const { Content } = Layout;
const { Title, Text } = Typography;



const LoginPage: React.FC = () => {
	const dispatch=useDispatch();
	const { LoginUserLoad,LoginUserRes }: any = useSelector((state: RootState) => state?.auth);
    const navigate = useNavigate();
	
  
	useEffect(() => {
		if (LoginUserRes.data && LoginUserRes?.data?.status === 200) {
			sessionStorage.setItem('user', JSON.stringify(LoginUserRes?.token));
             navigate('/tasks');
		}  else if(LoginUserRes.data && LoginUserRes?.data?.status === 401){
			
			   message.error(LoginUserRes?.data?.message || "Login failed. Please try again.");
		}
		
	}, [LoginUserRes]);
	const onFinish = async (values: { email: string; password: string }) => {
		console.log('Login values:', values);
		await dispatch(LoginUser(values));
	};

	return (
		<div className="task-login-layout">
			<Content className="task-login-content">
				<Card className="task-login-card">
					<div className="task-login-sections">
						{/* Left Section - Branding */}
						<div className="task-left-section">
							<div className="task-brand-content">
								<div className="task-icon-container">
									<span className="task-management-icon">📋</span>
								</div>
								<Title level={2} className="task-brand-title">
									TaskFlow Pro
								</Title>
								<Text className="task-brand-subtitle">
									Streamline your productivity with intelligent task management
								</Text>
								<div className="task-features">
									<div className="task-feature-item">
										<span className="feature-icon">✓</span>
										<span>Smart task prioritization</span>
									</div>
									<div className="task-feature-item">
										<span className="feature-icon">✓</span>
										<span>Team collaboration</span>
									</div>
									<div className="task-feature-item">
										<span className="feature-icon">✓</span>
										<span>Progress tracking</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right Section - Login Form */}
						<div className="task-right-section">
							<div className="task-login-form-container">
								<div className="task-form-header">
									<Title level={3} className="task-login-title">
										Welcome Back
									</Title>
									<Text className="task-login-subtitle">
										Sign in to your account to continue
									</Text>
								</div>

								<Form 
									name="taskLogin" 
									onFinish={onFinish} 
									layout="vertical" 
									className="task-login-form"
									autoComplete="off"
								>
									<Form.Item
										name="email"
										rules={[
											{ required: true, message: 'Please enter your email address' },
											{ type: 'email', message: 'Please enter a valid email address' }
										]}
									>
										<Input
											prefix={<UserOutlined className="task-input-icon" />}
											placeholder="Enter your email"
											size="large"
											className="task-login-input"
											autoFocus
											maxLength={150}
										/>
									</Form.Item>

									<Form.Item
										name="password"
										rules={[
											{ required: true, message: 'Please enter your password' },
											{ min: 6, message: 'Password must be at least 6 characters' }
										]}
									>
										<Input.Password
											prefix={<LockOutlined className="task-input-icon" />}
											placeholder="Enter your password"
											size="large"
											className="task-login-input"
										/>
									</Form.Item>

									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
											size="large"
											block
											className="task-login-button"
										>
											Sign In
										</Button>
									</Form.Item>
								</Form>

								

								<Text className="task-copyright-text">
									© 2025 Nandan. All rights reserved.
								</Text>
							</div>
						</div>
					</div>
				</Card>
			</Content>
		</div>
	);
};

export default LoginPage;
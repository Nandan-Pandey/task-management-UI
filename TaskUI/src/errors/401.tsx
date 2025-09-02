import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import './errorpage.css';

function UnAuthorized() {
	return (
		<div className="errormain">
			<Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div className="errorCard">
						<div style={{ paddingLeft: '20px' }}>
							<img src="/assets/images/401imgs.png" className="errorimg" alt="" width={250} />
							<h4 className="errorPageheading">401 Unauthorized</h4>
							<p>It looks like you need to sign in to view this page. Don't worry, we’ll help you get back on track!</p>
						</div>
						<Link to="/">
							<Button type="primary" className="gx-btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
								Back to Login
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default UnAuthorized;

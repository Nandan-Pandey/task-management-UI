import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import './errorpage.css';

function NotFound() {
	const token = sessionStorage.getItem('accessToken');
	return (
		<div className="errormain">
			<Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div className="errorCard">
						<div style={{ paddingLeft: '20px' }}>
							<img src="/assets/images/404imgs.png" className="errorimg" alt="" width={350} />
							<h4 className="errorPageheading">Sorry, Page Not Found</h4>

							<p>Sorry, the page you're looking for is unavailable. It may have been moved, deleted, or perhaps it never existed at all.</p>
						</div>
						<Link to={token?.length ? '/projects' : '/'}>
							<Button type="primary" className="gx-btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
								{token?.length ? 'Back to Home' : 'Back to Login'}
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default NotFound;

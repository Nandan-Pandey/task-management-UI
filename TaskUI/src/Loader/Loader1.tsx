import React from 'react';
import './loader1.css';

const Loader1: React.FC = () => {
	return (
		<div className="loader-container">
			<div className="loader">
				<div className="circle">
					<div className="dot"></div>
					<div className="outline"></div>
				</div>
				<div className="circle">
					<div className="dot"></div>
					<div className="outline"></div>
				</div>
				<div className="circle">
					<div className="dot"></div>
					<div className="outline"></div>
				</div>
				<div className="circle">
					<div className="dot"></div>
					<div className="outline"></div>
				</div>
			</div>
		</div>
	);
};

export default Loader1;

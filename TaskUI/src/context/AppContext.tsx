import React from 'react';

export const AppContext = React.createContext<{
	scroll: any;
	setScroll: any;
	SocketData: any;
	setSocketData: any;
	TerraformDataNotification?: any;
	setTerraformDataNotification?: any;
}>({
	scroll: {},
	setScroll: () => {},
	SocketData: {},
	setSocketData: () => {},
	TerraformDataNotification: {},
	setTerraformDataNotification: () => {}
});

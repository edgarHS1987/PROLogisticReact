import {useState} from 'react';
import PropTypes from 'prop-types';

import {Col, Divider, Grid, Nav, Sidenav} from 'rsuite';


const Sidebar = ({
	expanded, 
	menu,
	onChangeMenu,
	onSelectMenu
})=>{
	const [activeMenuKey, setActiveMenuKey] = useState('1');

	return(
		<Grid fluid className="p-0 m-0 full-height">
			<Grid fluid className="pt-2 text-center">
				<Col xs={12} md={6} lg={expanded ? 12 : 24} lgOffset={expanded ? 6 : 0} className="p-0 pb-2">
				</Col>
				<Col xs={24} xlHidden={!expanded} xxlHidden={!expanded} lgHidden={!expanded} lg={24}>
					<h4 className="sidebar title">Logistic App</h4>
				</Col>
			</Grid>

			<Divider />

			<Sidenav
				expanded={expanded}
				appearance="subtle"
			>
				<Nav activeKey={activeMenuKey} onSelect={setActiveMenuKey}>
					{menu.map((menuItem, index)=>
						menuItem.show ? 
							menuItem.submenu.length === 0 ? 
								<Nav.Item key={index} eventKey={index + 1} onClick={()=>onSelectMenu(menuItem.url)} icon={menuItem.icon}>
									{menuItem.title}
								</Nav.Item>
							: 
								<Nav.Menu key={index} open={menuItem.open} onToggle={(open)=>onChangeMenu(open, index)} placement="rightStart" eventKey={index+1} title={menuItem.title} icon={menuItem.icon}>
									{menuItem.submenu.map((submenu, j)=>
										submenu.show &&
											<Nav.Item key={j} eventKey={(index+1)+(j+1)} active={submenu.active} onClick={()=>onSelectMenu(submenu.url)}>
												{submenu.title}
											</Nav.Item>
									)}
								</Nav.Menu>
						: null						
					)}
				</Nav>
			</Sidenav>	
		</Grid>
	)
};

export default Sidebar;

Sidebar.defaultProps = {
	expanded: false,
};

Sidebar.propTypes = {
	expanded: PropTypes.bool,
	menu: PropTypes.array.isRequired,
	onChangeMenu: PropTypes.func.isRequired,
	onSelectMenu: PropTypes.func.isRequired
};
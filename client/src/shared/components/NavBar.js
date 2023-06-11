import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './NavBar.css';

const NavBar = () => {
	return (
		<div>
			<Navbar className='navbar-translucent'>
				<Container>
					<Navbar.Brand className='travel-safety'>TravelSafety</Navbar.Brand>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='me-auto'>
							<Nav.Link href='/' className='home-link'>
								Home
							</Nav.Link>
						</Nav>
						<Nav className='justify-content-end'>
							<Nav.Link href='/alert'>
								<Button variant='danger'>Get Alert</Button>
							</Nav.Link>
							<Nav.Link href='/login'>
								<Button variant='light'>Login</Button>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};

export default NavBar;

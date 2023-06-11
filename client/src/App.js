import MapContainer from './Map/Map';
import './App.css';
import NavBar from './shared/components/NavBar';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Alert from './shared/components/pages/Alert';
import Login from './shared/components/pages/Login';

function App() {
	// const handleSubmit = () => {
	//   // Perform API request with searchParams and handle the data
	//   console.log(searchParams); // Example: Log the searchParams to the console
	// };

	return (
		<div className='App'>
			<Router>
				<div className='App'>
					<NavBar />
					{/* <div className='container'> */}
					<Switch>
						<Route exact path='/' component={MapContainer} />
						<Route exact path='/alert' component={Alert} />
						<Route exact path='/login' component={Login} />
					</Switch>
					{/* </div> */}
				</div>
			</Router>
		</div>
	);
}

export default App;

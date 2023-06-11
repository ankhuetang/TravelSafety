import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './Alert.css';
import SearchBar from '../../../Map/SearchBar';

const Alert = ({ onSubmit }) => {
	const [location, setLocation] = useState(null);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [duration, setDuration] = useState(''); // in days
	const [radius, setRadius] = useState(''); // in miles

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit({ location, startDate, endDate });
	};

	const formIsValid = location !== null && duration !== '' && radius !== '';

	return (
		<div>
			<Container className='d-flex justify-content-center'>
				<Form.Text className='description'>
					Specify an address to receive daily alerts via message
				</Form.Text>
			</Container>

			<Container className='d-flex justify-content-center'>
				<div className='alert-form'>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId='location'>
							<Form.Label>
								Location
								<span className='red-asterisk'>*</span>
							</Form.Label>
							<Form.Control
								type='text'
								value={location}
								onChange={(event) => setLocation(event.target.value)}
							/>
						</Form.Group>
						{/* <Form.Group controlId='startDate'>
							<Form.Label>Start Date:</Form.Label>
							<Form.Control
								type='date'
								value={startDate}
								onChange={(event) => setStartDate(event.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='endDate'>
							<Form.Label>End Date:</Form.Label>
							<Form.Control
								type='date'
								value={endDate}
								onChange={(event) => setEndDate(event.target.value)}
							/>
						</Form.Group> */}
						<Form.Group controlId='duration'>
							<Form.Label>
								Duration (in days)
								<span className='red-asterisk'>*</span>
							</Form.Label>
							<Form.Control
								type='number'
								value={duration}
								onChange={(event) => setDuration(event.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='radius'>
							<Form.Label>
								Radius (in miles)
								<span className='red-asterisk'>*</span>
							</Form.Label>
							<Form.Control
								type='number'
								value={radius}
								onChange={(event) => setRadius(event.target.value)}
							/>
						</Form.Group>
						{formIsValid ? (
							<Button className='submit-button' variant='primary' type='submit'>
								Search
							</Button>
						) : (
							<fieldset disabled>
								<Button
									className='submit-button'
									variant='secondary'
									type='submit'
								>
									Search
								</Button>
							</fieldset>
						)}
					</Form>
				</div>
			</Container>
		</div>
	);
};

export default Alert;

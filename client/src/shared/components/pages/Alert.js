import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './Alert.css';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import axios from 'axios';

const Alert = () => {
	const [duration, setDuration] = useState(''); // in days
	const [radius, setRadius] = useState(''); // in miles
	const [autocomplete, setAutocomplete] = useState(null);
	const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	const handleSubmit = async (event) => {
		event.preventDefault();
		// console.log('handleSubmit called');
		// console.log('location: ', autocomplete);
		// console.log('radius: ', radius, ' kilometers');
		// console.log('duration: ', duration, ' days');
		try {
			const res = await axios.post('http://localhost:5000/map/subscribe', {
				address: { autocomplete },
				radius: { radius },
				duration: { duration },
			});
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	};

	const onLoad = (autocomplete) => {
		console.log('autocomplete: ', autocomplete);
		setAutocomplete(autocomplete);
	};

	const onPlaceChanged = () => {
		if (autocomplete !== null) {
			console.log(autocomplete.getPlace());
		} else {
			console.log('Autocomplete is not loaded yet');
		}
	};

	const formIsValid = autocomplete !== null && duration !== '' && radius !== '';

	return (
		<LoadScript googleMapsApiKey={API_KEY} libraries={['places']}>
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
								<Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
									<input type='text' placeholder='Enter location' />
								</Autocomplete>
							</Form.Group>
							<Form.Group controlId='duration'>
								<Form.Label>
									Duration (in days)
									<span className='red-asterisk'>*</span>
								</Form.Label>
								<Form.Control
									type='number'
									min={1}
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
									min={1}
									value={radius}
									onChange={(event) => setRadius(event.target.value)}
								/>
							</Form.Group>
							{formIsValid ? (
								<Button
									className='submit-button'
									variant='primary'
									type='submit'
								>
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
		</LoadScript>
	);
};

export default Alert;

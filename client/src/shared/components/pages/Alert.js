import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './Alert.css';
// import ComboboxSearch from '../../ComboboxSearch';
// import { useState, useMemo } from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete from 'use-places-autocomplete';
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import { useLoadScript } from '@react-google-maps/api';

const Alert = () => {
	// const [location, setLocation] = useState(null);
	const [duration, setDuration] = useState(''); // in days
	const [radius, setRadius] = useState(''); // in miles

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	const autocompleteObject = usePlacesAutocomplete();
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = autocompleteObject;

	const formIsValid = value !== null && duration !== '' && radius !== '';

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Maybe unecessary
		libraries: ['places'],
	});

	const handleSelect = async (address) => {
		setValue(address, false);
		clearSuggestions();
	};

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
							{/* <Form.Control
								type='text'
								value={location}
								onChange={(event) => setLocation(event.target.value)}
							/> */}
							{/* <ComboboxSearch /> */}
							<Combobox onSelect={handleSelect}>
								<ComboboxInput
									value={value}
									onChange={(event) => setValue(event.target.value)}
									disabled={!ready}
									className='combobox-input'
									placeholder='Enter location'
								/>
								<ComboboxPopover>
									<ComboboxList>
										{status === 'OK' &&
											data.map(({ place_id, description }) => (
												<ComboboxOption key={place_id} value={description} />
											))}
									</ComboboxList>
								</ComboboxPopover>
							</Combobox>
						</Form.Group>
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

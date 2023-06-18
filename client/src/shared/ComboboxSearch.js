import React from 'react';
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

const ComboboxSearch = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Maybe unecessary
		libraries: ['places'],
	});

	return (
		<div className='places-container'>
			<PlacesAutocomplete />
		</div>
	);
};

const PlacesAutocomplete = () => {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutocomplete();

	const handleSelect = async (address) => {
		setValue(address, false);
		clearSuggestions();
	};

	return (
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
	);
};

export default ComboboxSearch;

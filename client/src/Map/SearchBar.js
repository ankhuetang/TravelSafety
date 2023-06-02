import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "./SearchBar.css"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import React, { useState } from 'react'

const SearchBar = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async(address) => {
        setValue(address, false)
        clearSuggestions();

        const results = await getGeocode({address});
        const {lat, lng} = await getLatLng(results[0]);
        setSelected({lat, lng})
    }
    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                disabled={!ready} 
                className="combobox-input"
                placeholder="Search an address" />
            <ComboboxPopover className="combobox-popover">
                <ComboboxList className="combobox-list">
                    { status === "OK" && data.map(({place_id, description}) => (<ComboboxOption className="combobox-option" key={place_id} value={description}/>))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    )
}

export default SearchBar;


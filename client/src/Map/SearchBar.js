import "./SearchBar.css"
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from 'react'

const SearchBar = ({ setLocation }) => {
    const searchInput = useRef();
    const handleLocation = () => {
        const place = searchInput.current.getPlaces();
        if (place) {
            console.log("place: ", place[0])
            const lat = place[0].geometry.location.lat()
            const lng = place[0].geometry.location.lng()
            setLocation({lat, lng})      
        }
    }
    return (
        <StandaloneSearchBox 
            onLoad={ref => searchInput.current = ref}
            onPlacesChanged={handleLocation}>
                <input 
                    type="text"
                    placeholder="Search an adress"
                    className="combobox-input"
                />
        </StandaloneSearchBox>
    )
}

export default SearchBar;




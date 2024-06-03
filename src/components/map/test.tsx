import React, { useEffect, useState } from 'react';
import { SearchMapRequest } from 'apis';
import { SearchMapResponseDto } from 'apis/response/map';

declare global {
    interface Window {
        kakao: any;
    }
}

const Test: React.FC = () => {
    const [map, setMap] = useState<any>(null);
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [places, setPlaces] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d0630e67d7487ad8a58bae7c65823e88&autoload=false`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map') as HTMLElement;
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3
                };
                const map = new window.kakao.maps.Map(container, options);
                setMap(map);
            });
        };
    }, []);

    useEffect(() => {
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const locPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: locPosition
                    });
                    map.setCenter(locPosition);
                    setCurrentPosition({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting current position:', error);
                }
            );
        }
    }, [map]);

    const handleSearch = async () => {
        try {
            if (!currentPosition) return;
            const { lat, lng } = currentPosition;
            const response: SearchMapResponseDto = await SearchMapRequest(searchQuery, lat, lng, 5000);
            setPlaces(response.documents);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    return (
        <div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <div id="map" style={{ width: '100%', height: '600px' }}></div>
            <ul>
                {places.map((place, index) => (
                    <li key={index}>{place.place_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Test;

import React, { useCallback, useEffect, useState } from 'react';
import { Container as MapDiv, Marker, NaverMap, useNavermaps } from 'react-naver-maps';
import axios from 'axios';
import SearchBar from 'components/searchbar';
import './style.css';

interface Place {
    title: string;
    point: {
        x: number;
        y: number;
    };
}

const MapComponent: React.FC = () => {
    const navermaps = useNavermaps();
    const handleZoomChanged = useCallback((zoom: number) => { }, []);

    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        const getCurrentPosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting current position:', error);
                }
            );
        };
        getCurrentPosition();
    }, []);

    const handleSearch = useCallback((query: string) => {
        if (!currentPosition) return;

        axios.get('http://localhost:4040/api/search', {
            params: {
                query,
                lat: currentPosition.lat,
                lng: currentPosition.lng,
                radius: 5000,
            },
        }).then(response => {

            console.log('API Response:', response.data);
            console.log(currentPosition.lat, currentPosition.lng)
            console.log(response.data.items)
            
            const items: Place[] = response.data.items.map((item: any) => ({
                title: item.title,
                point: {
                    x: item.mapx,
                    y: item.mapy,
                }
            }));
            setPlaces(items);
        }).catch(error => {
            console.error('Error searching places:', error);
        });
    }, [currentPosition]);

    return (
        <div style={{ position: 'relative' }}>
            <SearchBar onSearch={handleSearch} />
            {currentPosition && currentPosition.lat && currentPosition.lng && (
                <NaverMap
                    zoomControl
                    zoomControlOptions={{ position: navermaps?.Position.TOP_RIGHT }}
                    defaultCenter={{ lat: currentPosition.lat, lng: currentPosition.lng }}
                    defaultZoom={13}
                    onZoomChanged={handleZoomChanged}
                    draggable={true}
                    pinchZoom={true}
                    scrollWheel={true}
                    keyboardShortcuts={true}
                    disableDoubleTapZoom={false}
                    disableDoubleClickZoom={false}
                    disableTwoFingerTapZoom={false}
                    disableKineticPan={false}
                    tileTransition={true}
                    minZoom={7}
                    maxZoom={21}
                    scaleControl={true}
                    logoControl={true}
                    mapDataControl={true}
                    mapTypeControl={true}
                    // style={{ width: '100%', height: '100%' }}
                >
                    {currentPosition && (
                        <Marker
                            position={{ lat: currentPosition.lat, lng: currentPosition.lng }}
                            animation={navermaps?.Animation.BOUNCE}
                        />
                    )}
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            position={{ lat: place.point.y, lng: place.point.x }}
                            title={place.title}
                        />
                    ))}
                </NaverMap>
            )}
        </div>
    );
};

const Map: React.FC = () => {
    return (
        <MapDiv
            style={{
                position: 'relative',
                width: '100%',
                height: '600px',
            }}
        >
            <MapComponent />
        </MapDiv>
    );
};

export default Map;

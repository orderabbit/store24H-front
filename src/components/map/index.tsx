import React, { useCallback, useEffect, useState } from 'react';
import { Container as MapDiv, Marker, NaverMap, useNavermaps } from 'react-naver-maps';

const MapComponent: React.FC = () => {
    const navermaps = useNavermaps();
    const handleZoomChanged = useCallback((zoom: number) => { }, []);

    const [currentPosition, setCurrentPosition] = useState<any>(null);

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

    return (
        <div>
            {currentPosition && currentPosition.lat && currentPosition.lng && (
                <NaverMap
                    zoomControl
                    zoomControlOptions={{ position: navermaps.Position.TOP_RIGHT, }}
                    defaultCenter={{ lat: currentPosition.lat, lng: currentPosition.lng }} defaultZoom={13}
                    onZoomChanged={handleZoomChanged} draggable={true} pinchZoom={true} scrollWheel={true} keyboardShortcuts={true} disableDoubleTapZoom={false}
                    disableDoubleClickZoom={false} disableTwoFingerTapZoom={false} disableKineticPan={false} tileTransition={true} minZoom={7} maxZoom={21}
                    scaleControl={true} logoControl={true} mapDataControl={true} mapTypeControl={true}
                >
                    {currentPosition && (
                        <Marker
                            position={{ lat: currentPosition.lat, lng: currentPosition.lng }}
                            animation={2}
                        />
                    )}
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

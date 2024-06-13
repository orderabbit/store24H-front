import React, { useEffect, useState } from 'react';
import { SearchMapRequest } from 'apis';
import './style.css';
import StoreInfoPanel from 'components/storeinfo';
import { SearchMapResponseDto } from 'apis/response';

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
    const [markers, setMarkers] = useState<any[]>([]);
    const [isMapTypeRoadmap, setIsMapTypeRoadmap] = useState<boolean>(true);
    const [isSearchContainerVisible, setIsSearchContainerVisible] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [selectedStore, setSelectedStore] = useState<any>(null);
    const [isStoreInfoVisible, setIsStoreInfoVisible] = useState<boolean>(false);

    const createMarker = (position: any, imageSrc: string, imageSize: { width: number; height: number }, place: { place_name: string; address_name: string; road_address_name: string; x: number; y: number; } | null) => {
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, new window.kakao.maps.Size(imageSize.width, imageSize.height));
        const marker = new window.kakao.maps.Marker({
            map: map,
            position: position,
            image: markerImage
        });
        window.kakao.maps.event.addListener(marker, 'click', function() {
            handleMarkerClick(place);
        });
    
        return marker;
    };

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

                map.setZoomable(false);
                const zoomHandler = (event: WheelEvent) => {
                    if (isAnimating) return;
                    event.preventDefault();
                    const delta = event.deltaY;
                    const level = map.getLevel();
                    if (delta > 0) {
                        setIsAnimating(true);
                        map.setLevel(level + 1, { animate: true });
                    } else {
                        setIsAnimating(true);
                        map.setLevel(level - 1, { animate: true });
                    }
                    setTimeout(() => setIsAnimating(false), 300);
                };

                container.addEventListener('wheel', zoomHandler);

                return () => {
                    container.removeEventListener('wheel', zoomHandler);
                };
            });
        };
    }, []);

    useEffect(() => {
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const locPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    createMarker(locPosition, 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-256.png', { width: 24, height: 35 }, null);
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
            const response: SearchMapResponseDto = await SearchMapRequest(searchQuery, lat, lng);

            markers.forEach(marker => marker.setMap(null));
            setMarkers([]);

            setPlaces(response.documents);

            const newMarkers = response.documents.map(place => {
                const position = new window.kakao.maps.LatLng(place.y, place.x);
                return createMarker(position, 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', { width: 24, height: 35 }, place);
            });

            setMarkers(newMarkers);
            setSelectedStore(null);
            setIsSearchContainerVisible(true);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    const toggleMapType = () => {
        setIsMapTypeRoadmap(prevState => !prevState);
        if (map) {
            const newMapType = isMapTypeRoadmap ? window.kakao.maps.MapTypeId.HYBRID : window.kakao.maps.MapTypeId.ROADMAP;
            map.setMapTypeId(newMapType);
        }
    };

    const toggleSearchContainer = () => {
        setIsSearchContainerVisible(prevState => !prevState);
        setIsStoreInfoVisible(false);
    };

    const handleStoreClick = (store: any) => {
        setSelectedStore(store);
        setIsStoreInfoVisible(prevState => {
            return store === selectedStore ? !prevState : true;
        });
    };

    const handleMarkerClick = (place: any) => {
        setSelectedStore(place);
        setIsStoreInfoVisible(true);
    };

    return (
        <div id="map-container">
            <div className="search-icon" onClick={toggleSearchContainer}>
                <img src="https://cdn-icons-png.flaticon.com/512/64/64673.png" alt="Search" />
            </div>
            <div className="search-container" style={{ display: isSearchContainerVisible ? 'block' : 'none' }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }} />
                <button onClick={handleSearch}>Search</button>
                <div className="overlay" style={{ display: isSearchContainerVisible ? 'block' : 'none' }}>
                    {places.map((place, index) => (
                        <div key={index} className="search-item" onClick={() => handleStoreClick(place)}>
                            {place.place_name}
                        </div>
                    ))}
                </div>
            </div>
            {selectedStore && (
                <div className={`store-info-container ${isStoreInfoVisible ? 'visible' : ''}`}>
                    <StoreInfoPanel store={selectedStore} />
                </div>
            )}
            <div id="map"></div>
            <div className="map-toggle-container">
                <div className={`map-toggle ${isMapTypeRoadmap ? "active" : ""}`} onClick={toggleMapType}>지도</div>
                <div className={`map-toggle ${!isMapTypeRoadmap ? "active" : ""}`} onClick={toggleMapType}>스카이뷰</div>
            </div>
        </div>
    );
};

export default Test;

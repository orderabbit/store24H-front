import React, { useEffect, useState } from 'react';

// Kakao API를 타입스크립트에서 인식하게 하기 위한 타입 선언
declare global {
    interface Window {
        kakao: any;
    }
}

const Test: React.FC = () => {
    const [map, setMap] = useState<any>(null);
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_JAVASCRIPT_KEY&autoload=false`;
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
                (position) => {
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

    return (
        <div>
            <div id="map" style={{ width: '100%', height: '600px' }}></div>
        </div>
    );
};

export default Test;

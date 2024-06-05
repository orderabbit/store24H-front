import React from 'react';

interface Props {
    store: any;
}

const StoreInfoPanel: React.FC<Props> = ({ store }) => {
    return (
        <div className="store-info-panel">
            <div>{store.place_name}</div>
            <div>주소: {store.address_name}</div>
            <div>전화번호: {store.phone}</div>
        </div>
    );
};

export default StoreInfoPanel;


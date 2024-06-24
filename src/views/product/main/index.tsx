
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import ReviewList from 'views/product/review';

const Search: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
                <h1 className="text-center mb-5">
                    <a href="/" className="text-decoration-none">
                        <span style={{ color: '#4285f4', fontSize: '90px' }}>G</span>
                        <span style={{ color: '#ea4335', fontSize: '60px' }}>o</span>
                        <span style={{ color: '#fbbc05', fontSize: '60px' }}>o</span>
                        <span style={{ color: '#4285f4', fontSize: '60px' }}>g</span>
                        <span style={{ color: '#34a853', fontSize: '60px' }}>l</span>
                        <span style={{ color: '#ea4335', fontSize: '60px' }}>e</span>
                    </a>
                </h1>
                <form onSubmit={handleSearch} className="d-flex flex-column align-items-center gap-3">
                    <div className="input-group mb-3" style={{ maxWidth: '500px' }}>
                        <input
                            name="keyword"
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="검색"
                            aria-label="검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">검색</button>
                    </div>
                    <button onClick={() => navigate('/product/write')}>상품등록</button>
                </form>
                <div>
                    {ReviewList(1)}
                </div>
            </div>
        </div>
    );
};

export default Search;

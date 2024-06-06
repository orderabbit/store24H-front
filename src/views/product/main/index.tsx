// Search.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Search: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            navigate(`/save?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div className="container">
            <h1>
                <a href="/">
                    <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
                </a>
            </h1>
            <div className="d-flex flex-column align-items-center gap-5">
                <form onSubmit={handleSearch} className="d-flex flex-column align-items-center gap-7">
                    <div className="search-bar input-group mb-3">
                        <input
                            name="keyword"
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="검색"
                            aria-label="검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="input-group-append"></div>
                    </div>
                    <div className="d-flex justify-content-center gap-7">
                        <button type="submit" className="btn btn-primary">검색</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Search;

// SearchList.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetProductRequest } from 'apis';
import './style.css';

interface Product {
    productId: number;
    title: string;
    link: string;
    image: string;
    lowPrice: string;
    count: number;
    category1: string;
    category2: string;
}

const SearchList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const searchKeyword = query.get('keyword');

    useEffect(() => {
        const fetchProducts = async () => {
            if (searchKeyword) {
                try {
                    const response = await GetProductRequest(searchKeyword);
                    setProducts(response.data.items);
                } catch (error) {
                    console.error('Failed to fetch products', error);
                }
            }
        };

        fetchProducts();
    }, [searchKeyword]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <div className="search-container">
            <h2 className="page-title">Api검색+등록</h2>
            <div className="d-flex flex-column align-items-center gap-5">
                <form onSubmit={handleSearch} className="search-form d-flex flex-column align-items-center gap-7">
                    <div className="input-group mb-3">
                        <input
                            name="keyword"
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="검색"
                            aria-label="검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="input-group-append">
                            <input type="submit" value="검색" className="btn search-btn view-all-button" />
                        </div>
                    </div>
                </form>
            </div>
            <ul className="list-group">
                {products.map((product) => (
                    <li key={product.productId} className="product-item list-group-item">
                        <div className="d-flex align-items-center">
                            <img src={product.image} alt={product.title} width="100" />
                            <div className="ml-3">
                                <a href={product.link} target="_blank" rel="noopener noreferrer">{product.title}</a>
                                <div>{product.lowPrice} 원</div>
                                <div>{product.category1}/{product.category2}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="d-flex justify-content-center gap-7">
                <button id="allProductsButton" className="btn view-all-button" onClick={() => navigate('/product/list')}>
                    전체 상품 목록으로
                </button>
            </div>
        </div>
    );
};

export default SearchList;

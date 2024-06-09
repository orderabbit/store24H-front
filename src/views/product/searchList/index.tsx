// SearchList.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetProductRequest, PostProductRequest } from 'apis';
import './style.css';
import axios from 'axios';
import { SaveProductRequestDto } from 'apis/request';
import { useCookies } from 'react-cookie';

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
    const [cookies, setCookie] = useCookies();
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
                    console.log(response.data.items);
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

    const saveProductClickHandler = async (product: Product) => {
        const accessToken = cookies.accessToken;
        const formData: SaveProductRequestDto = {
            productId: product.productId,
            title: product.title,
            link: product.link,
            image: product.image,
            lowPrice: product.lowPrice,
            category1: product.category1,
            category2: product.category2
        };

        try {
            const response = await PostProductRequest(formData, accessToken);
            if (response.code === 'SU') alert("상품이 저장되었습니다.");
            if (response.code === 'DP') alert("이미 저장된 상품입니다.");
            if (response.code === 'DBE') alert("상품 저장에 실패했습니다.");
            if (response.code === 'AF') alert("로그인이 필요합니다.");
            
        } catch (error) {
            console.error("Error saving product", error);
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
                        <button className="btn view-all-button" onClick={() => saveProductClickHandler(product)}>저장</button>
                    </li>
                ))}
            </ul>
            <div className="d-flex justify-content-center gap-7">
                <button id="allProductsButton" className="btn view-all-button" onClick={() => navigate('/product/list')}>
                    전체 상품 목록으로
                </button>
            </div>
            <button id="allProductsButton" className="btn view-all-button" onClick={() => saveProductClickHandler}>
                저장
            </button>
        </div>
    );
};

export default SearchList;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GetProductListRequest } from 'apis';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';

interface Product {
    productId: number;
    title: string;
    link: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
}

const CartList: React.FC = () => {
    const { loginUser } = useLoginUserStore();
    const [cookies, setCookie] = useCookies();
    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('title');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!loginUser) {
                    navigate('/login');
                    return;
                }
                const response = await GetProductListRequest(loginUser?.userId, cookies.accessToken);
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, [loginUser, cookies.accessToken]);

    return (
        <div className="container">
            <div>
                <h2>Product List</h2>
                <div className="search-bar input-group mb-3">
                    <input
                        name="keyword"
                        type="text"
                        className="w-[120px] form-control rounded-pill"
                        placeholder="상품 검색"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <div className="input-group-append">
                        <div className="input-group-prepend">
                            <select
                                className="form-select rounded-pill"
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="title">제목</option>
                                <option value="category">카테고리</option>
                            </select>
                        </div>
                        {/* <button type="button" onClick={submitForm} className="btn search-btn">검색</button> */}
                    </div>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th> </th>
                        <th>상품번호</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>분류</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td><img src={product.image} alt={product.title} width="100" /></td>
                            <td>{product.productId}</td>
                            <td>
                                <a href={product.link} target="_blank" rel="noopener noreferrer">{product.title}</a>
                            </td>
                            <td>{product.lowPrice} 원</td>
                            <td>{product.category1}/{product.category2}</td>
                            <td>
                                <div>
                                    <button className="btn btn-warning" onClick={() => navigate(`/product/edit/${product.productId}`)}>수정</button>
                                    <button className="mt-[5px] btn btn-warning" onClick={() => navigate(`/product/delete/${product.productId}`)}>삭제</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center gap-7">
                <button id="apiProductsButton" className="btn btn-primary" onClick={() => navigate('/api/search')}>
                    Api등록 검색으로
                </button>
            </div>
        </div>
    );
};

export default CartList;

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
    productId: string;
    title: string;
    image: string;
    link: string;
    lprice: number;
    category1: string;
    category2: string;
}

interface Props {
    products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
    const [keyword, setKeyword] = useState<string>('');
    const [category, setCategory] = useState<string>('title');

    const searchButtonClickHandler = () => {
        window.location.href = `/product/search?keyword=${keyword}&category=${category}`;
    };

    return (
        <div className="container">
            <div>
                <h2>Product List</h2>
                <div className="search-bar input-group mb-3">
                    <input
                        name="keyword"
                        type="text"
                        className="form-control rounded-pill"
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
                        <button type="button" onClick={searchButtonClickHandler} className="btn search-btn">
                            검색
                        </button>
                    </div>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>상품번호</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>분류</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>
                                <img src={product.image} alt={product.title} width="100" />
                            </td>
                            <td>{product.productId}</td>
                            <td>
                                <a href={product.link} target="_blank" rel="noopener noreferrer">
                                    {product.title}
                                </a>
                            </td>
                            <td>{product.lprice} 원</td>
                            <td>
                                {product.category1}/{product.category2}
                            </td>
                            <td>
                                <div>
                                    <a href={`/product/edit/${product.productId}`} className="btn btn-warning">
                                        수정
                                    </a>
                                    <a href={`/product/delete/${product.productId}`} className="mt-2 btn btn-warning">
                                        삭제
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center gap-2">
                <button
                    id="apiProductsButton"
                    className="btn btn-primary"
                    onClick={() => (window.location.href = '/api/search')}
                >
                    Api등록 검색으로
                </button>
            </div>
        </div>
    );
};

export default ProductList;

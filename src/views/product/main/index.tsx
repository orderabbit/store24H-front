import { GetProductListRequest, GetSearchProductListRequest, PostCartRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import Pagination from 'components/Pagination';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { Product } from 'types/interface';
import './style.css';

export default function Main() {

    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<{
        priceAsc: boolean;
        priceDesc: boolean;
        nameAsc: boolean;
        nameDesc: boolean;
    }>({
        priceAsc: false,
        priceDesc: false,
        nameAsc: false,
        nameDesc: false,
    });

    const itemsPerPage = 10;
    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProducts = products.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await GetProductListRequest();
                if (sortBy.priceAsc) {
                    fetchedProducts.sort((a, b) => parseFloat(a.lowPrice) - parseFloat(b.lowPrice));
                } else if (sortBy.priceDesc) {
                    fetchedProducts.sort((a, b) => parseFloat(b.lowPrice) - parseFloat(a.lowPrice));
                } else if (sortBy.nameAsc) {
                    fetchedProducts.sort((a, b) => a.title.localeCompare(b.title));
                } else if (sortBy.nameDesc) {
                    fetchedProducts.sort((a, b) => b.title.localeCompare(a.title));
                }
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, [sortBy]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim() !== "") {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    const formatPrice = (price: string) => {
        return parseFloat(price).toLocaleString();
    };

    const handleSortBy = (sortType: string) => {
        setSortBy({
            priceAsc: sortType === "priceAsc",
            priceDesc: sortType === "priceDesc",
            nameAsc: sortType === "nameAsc",
            nameDesc: sortType === "nameDesc"
        });
    };

    return (
        <div className="list-search-container">
            <h2 className="list-page-title"> 상품 목록</h2>
            <div className="list-search-box">
                <form onSubmit={handleSearch} className="list-search-blank">
                    <div className="list-search-bar">
                        <div className="list-search-input">
                            <input name="keyword" type="text" className="list-search-keyword" placeholder="검색" aria-label="검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                            <div className="list-search-button">
                                <input type="submit" value="검색" className="search-button" />
                            </div>
                        </div>
                    </div >
                    <div className="items-sort">
                        <button type="button" className="item-sort" onClick={() => handleSortBy("priceAsc")}>가격 낮은 순</button>
                        <button type="button" className="item-sort" onClick={() => handleSortBy("priceDesc")}>가격 높은 순</button>
                        <button type="button" className="item-sort" onClick={() => handleSortBy("nameAsc")}>이름 오름차순</button>
                        <button type="button" className="item-sort" onClick={() => handleSortBy("nameDesc")}>이름 내림차순</button>
                    </div>
                </form >
            </div >
            < ul className="list-group" >
                {
                    displayedProducts.map((product) => (
                        <li key={product.productId} className="product-item-list-group-item">
                            <div className="items-center">
                                {product.titleImage && product.titleImage.map((image) => (
                                    <img key={image} className="product-detail-main-image" src={image} />
                                ))}
                            </div>
                            <div className="items-price">
                                <a href={`/product/detail/${product.productId}`} target="_blank" rel="noopener noreferrer">
                                    {product.title}
                                </a>
                                <div className="item-info">
                                    <div>
                                        {product.category1}/{product.category2}/{product.category3}
                                    </div>
                                </div>
                            </div>
                            <div className="item-price">
                                <div>{formatPrice(product.lowPrice)} 원</div>
                            </div>
                        </li>
                    ))
                }
            </ul >
            <div className="search-pagination-box">
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    viewPageList={Array.from(
                        { length: Math.ceil(products.length / itemsPerPage) },
                        (_, i) => i + 1
                    )}
                />
            </div>
            <button onClick={() => navigate("/product/write")}>등록</button>
        </div >
    )
}

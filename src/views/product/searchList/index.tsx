import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetProductRequest, PostProductRequest } from "apis";
import "./style.css";
import axios from "axios";
import { SaveProductRequestDto } from "apis/request";
import { useCookies } from "react-cookie";
import Pagination from 'components/Pagination';

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
  const [cookies] = useCookies();
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const searchKeyword = query.get("keyword");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchKeyword) {
        try {
          const response = await GetProductRequest(searchKeyword);
          console.log(response.data.items);
          setProducts(response.data.items);
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      }
    };

    fetchProducts();
  }, [searchKeyword]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
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
      category2: product.category2,
      count: quantities[product.productId] || 1,
    };

    try {
      const response = await PostProductRequest(formData, accessToken);
      if (response.code === "SU") alert("상품이 저장되었습니다.");
      if (response.code === "DP") alert("이미 저장된 상품입니다.");
      if (response.code === "DBE") alert("상품 저장에 실패했습니다.");
      if (response.code === "AF") alert("로그인이 필요합니다.");
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const buyProductClickHandler = async (product: Product) => {
    const accessToken = cookies.accessToken;
    const formData: SaveProductRequestDto = {
      productId: product.productId,
      title: product.title,
      link: product.link,
      image: product.image,
      lowPrice: product.lowPrice,
      category1: product.category1,
      category2: product.category2,
      count: quantities[product.productId] || 1,
    };

    try {
      const response = await PostProductRequest(formData, accessToken);
      if (response.code === "SU") {
        alert("구매하시겠습니까?");
        navigate("/address", { state: { selectedProduct: product } });
      }

      if (response.code === "AF") alert("로그인이 필요합니다.");
    } catch (error) {
      console.error("Error", error);
    }
  };

  const cartButtonClickHandler = () => {
    navigate("/cart");
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const incrementQuantity = (productId: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const decrementQuantity = (productId: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 1) - 1, 1),
    }));
  };


  return (
    <div className="list-search-container">
      <h2 className="list-page-title"> 검색 목록</h2>
      <div className="list-search-box">
        <form onSubmit={handleSearch} className="list-search-blank">
          <div className="list-search-bar">
            <div className="list-search-input">
              <input
                name="keyword"
                type="text"
                className="list-search-keyword"
                placeholder="검색"
                aria-label="검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <div className="list-search-button">
                <input type="submit" value="검색" className="search-button" />
              </div>
            </div>
            <div className="item-shopping-basket">
              <button
                id="allProductsButton"
                className="item-shopping-basket-button"
                onClick={cartButtonClickHandler}
              >
                장바구니
              </button>
            </div>
          </div>
        </form>
      </div>
      <ul className="list-group">
        {displayedProducts.map((product) => (
          <li key={product.productId} className="product-item-list-group-item">
            <div className="items-center">
              <img src={product.image} alt={product.title} width="100" />
            </div>
            <div className="items-price">
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                {product.title}
              </a>
              <div className="item-info">
                <div>{formatPrice(product.lowPrice)} 원</div>
                <div>
                  {product.category1}/{product.category2}
                </div>
              </div>
            </div>
            <div className="item-array">
              <div className="quantity-wrapper">
                <div className="quantity-selector">
                  <div className="icon-button" onClick={() => decrementQuantity(product.productId)}>
                    <div className="icon quantity-minus-icon"></div>
                  </div>
                  <span>{quantities[product.productId] || 1}</span>
                  <div className="icon-button" onClick={() => incrementQuantity(product.productId)}>
                    <div className="icon quantity-plus-icon"></div>
                  </div>
                </div>
              </div>
              <button
                className="item-store"
                onClick={() => saveProductClickHandler(product)}
              >
                담기
              </button>
              <button
                className="item-buy"
                onClick={() => buyProductClickHandler(product)}
              >
                구매
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="search-pagination-box">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          viewPageList={Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1)}
        />
      </div>
    </div>
  );
};

export default SearchList;

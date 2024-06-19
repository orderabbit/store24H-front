import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetListProductRequest,
  GetProductListRequest,
  PostCartRequest
} from "apis";
import "./style.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import Pagination from "components/Pagination";
import { useLoginUserStore } from "stores";
import { SaveCartRequestDto } from "apis/request";

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
  const { loginUser } = useLoginUserStore();
  
  const [cookies] = useCookies();
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [sortByPriceAsc, setSortByPriceAsc] = useState<boolean>(false);
  const [sortByPriceDesc, setSortByPriceDesc] = useState<boolean>(false);
  const [sortByNameAsc, setSortByNameAsc] = useState<boolean>(false);
  const [sortByNameDesc, setSortByNameDesc] = useState<boolean>(false);

  const itemsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const query = new URLSearchParams(location.search);
  const searchKeyword = query.get("keyword");
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);


  useEffect(() => {
    const fetchProducts = async () => {
      if (searchKeyword) {
        try {
          const response = await GetListProductRequest(searchKeyword);
          console.log(response.data.items);
          let fetchedProducts = response.data.items;
          if (sortByPriceAsc) {
            fetchedProducts = fetchedProducts.sort(
              (a: { lowPrice: string }, b: { lowPrice: string }) =>
                parseFloat(a.lowPrice) - parseFloat(b.lowPrice)
            );
          } else if (sortByPriceDesc) {
            fetchedProducts = fetchedProducts.sort(
              (a: { lowPrice: string }, b: { lowPrice: string }) =>
                parseFloat(b.lowPrice) - parseFloat(a.lowPrice)
            );
          } else if (sortByNameAsc) {
            fetchedProducts = fetchedProducts.sort(
              (a: { title: string }, b: { title: any }) =>
                a.title.localeCompare(b.title)
            );
          } else if (sortByNameDesc) {
            fetchedProducts = fetchedProducts.sort(
              (a: { title: any }, b: { title: string }) =>
                b.title.localeCompare(a.title)
            );
          }
          setProducts(fetchedProducts);
          const initialQuantities = fetchedProducts.reduce(
            (acc: { [key: number]: number }, product: Product) => {
              acc[product.productId] = 1;
              return acc;
            },
            {}
          );
          setQuantities(initialQuantities);
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      }
    };

    fetchProducts();
  }, [searchKeyword, sortByPriceAsc, sortByPriceDesc, sortByNameAsc, sortByNameDesc,]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const saveProductClickHandler = async (product: Product) => {
    const accessToken = cookies.accessToken;
    const formData: SaveCartRequestDto = {
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
<<<<<<< HEAD
      const response = await PostProductRequest(formData, accessToken);
      if (response.data.code === "SU") {
=======
      const response = await PostCartRequest(formData, accessToken);
      if (response.code === "SU") {
>>>>>>> c66924b2dee4c32e87d0c732939068061fe5b4a0
        alert("상품이 저장되었습니다.");
        if (!loginUser) return;
        const productListResponse = await GetProductListRequest(
          loginUser?.userId,
          accessToken
        );
        const updatedCartCount = productListResponse.data.items.length;
        triggerCartUpdateEvent(updatedCartCount);
      }
      if (response.data.code === "DP") alert("이미 저장된 상품입니다.");
      if (response.data.code === "DBE") alert("상품 저장에 실패했습니다.");
      if (response.data.code === "AF") alert("로그인이 필요합니다.");
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const triggerCartUpdateEvent = (cartCount: number) => {
    window.dispatchEvent(
      new CustomEvent("cartUpdate", {
        detail: { cartCount },
      })
    );
  };

  const buyProductClickHandler = async (product: Product) => {
    if (!window.confirm("구매하시겠습니까?")) {
      return;
    }
    const accessToken = cookies.accessToken;
    const formData: SaveCartRequestDto = {
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
<<<<<<< HEAD
      const response = await PostProductRequest(formData, accessToken);
      if (response.data.code === "SU") {
=======
      const response = await PostCartRequest(formData, accessToken);
      if (response.code === "SU") {
>>>>>>> c66924b2dee4c32e87d0c732939068061fe5b4a0
        navigate("/address", { state: { selectedProduct: product } });
      }
      if (response.data.code === "AF") alert("로그인이 필요합니다.");
    } catch (error) {
      console.error("Error", error);
    }
  };


  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
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

  const handleSortByPriceAsc = () => {
    if (sortByPriceAsc) {
      setSortByPriceAsc(false);
    } else {
      setSortByPriceAsc(true);
      setSortByPriceDesc(false);
      setSortByNameAsc(false);
      setSortByNameDesc(false);
    }
  };

  const handleSortByPriceDesc = () => {
    if (sortByPriceDesc) {
      setSortByPriceDesc(false);
    } else {
      setSortByPriceDesc(true);
      setSortByPriceAsc(false);
      setSortByNameAsc(false);
      setSortByNameDesc(false);
    }
  };

  const handleSortByNameAsc = () => {
    if (sortByNameAsc) {
      setSortByNameAsc(false);
    } else {
      setSortByNameAsc(true);
      setSortByPriceAsc(false);
      setSortByPriceDesc(false);
      setSortByNameDesc(false);
    }
  };

  const handleSortByNameDesc = () => {
    if (sortByNameDesc) {
      setSortByNameDesc(false);
    } else {
      setSortByNameDesc(true);
      setSortByPriceAsc(false);
      setSortByPriceDesc(false);
      setSortByNameAsc(false);
    }
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
          </div>
          <div className="items-sort">
            <button className="item-sort" onClick={handleSortByPriceAsc}>
              가격 낮은 순
            </button>
            <button className="item-sort" onClick={handleSortByPriceDesc}>
              가격 높은 순
            </button>
            <button className="item-sort" onClick={handleSortByNameAsc}>
              이름 오름차순
            </button>
            <button className="item-sort" onClick={handleSortByNameDesc}>
              이름 내림차순
            </button>
          </div>
        </form>
      </div>
      {products.length === 0 && (
        <div
          className="list-no-result"
          style={{
            height: "76px",
            textAlign: "center",
            fontSize: "24px",
            color: "rgba(0, 0, 0, 0.4)",
            fontWeight: "500",
          }}
        >
          검색 결과가 없습니다.
        </div>
      )}
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
                <div>
                  {product.category1}/{product.category2}
                </div>
              </div>
            </div>
            <div className="item-price">
              <div>{formatPrice(product.lowPrice)} 원</div>
            </div>
            <div className="item-array">
              <div className="quantity-wrapper">
                <div className="quantity-selector">
                  <div
                    className="icon-button"
                    onClick={() => decrementQuantity(product.productId)}
                  >
                    <div className="icon quantity-minus-icon"></div>
                  </div>
                  <span>{quantities[product.productId] || 1}</span>
                  <div
                    className="icon-button"
                    onClick={() => incrementQuantity(product.productId)}
                  >
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
          viewPageList={Array.from(
            { length: Math.ceil(products.length / itemsPerPage) },
            (_, i) => i + 1
          )}
        />
      </div>
    </div>
  );
};

export default SearchList;

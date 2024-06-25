import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteCartRequest, GetProductListRequest } from "apis";
import useLoginUserStore from "stores/login-user.store";
import { useCookies } from "react-cookie";
import "./style.css";

interface Product {
    productId: number;
    title: string;
    productImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    count: number;
}

const CartList: React.FC = () => {
    const { loginUser } = useLoginUserStore();
    const [cookies, setCookie] = useCookies();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [checkedProducts, setCheckedProducts] = useState<{ [key: number | string]: boolean; }>({});
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (loginUser?.userId) {
            setUserId(loginUser.userId);
            setIsLoggedIn(true);
        }
    }, [loginUser]);

    const fetchProducts = async () => {
        try {
            if (userId && cookies.accessToken) {
                const response = await GetProductListRequest(userId, cookies.accessToken);
                setProducts(response.data.items);
                const initialQuantities = response.data.items.reduce(
                    (acc: { [x: string]: number }, product: Product) => {
                        acc[product.productId] = product.count || 1;
                        return acc;
                    },
                    {}
                );
                setQuantities(initialQuantities);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [userId, cookies.accessToken]);

    const deleteButtonClickHandler = async (productId: number) => {
        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }
        if (userId && cookies.accessToken) {
            try {
                const response = await DeleteCartRequest(
                    productId,
                    cookies.accessToken
                );
                if (response?.code === "SU") {
                    alert("삭제되었습니다.");
                    const newProducts = products.filter(
                        (product) => product.productId !== productId
                    );
                    setProducts(newProducts);
                    const event = new CustomEvent("cartUpdate", {
                        detail: {
                            cartCount: newProducts.length,
                        },
                    });
                    window.dispatchEvent(event);
                } else {
                    alert("삭제에 실패했습니다.");
                }
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const calculateTotalPrice = () => {
        return selectedProducts
            .reduce((total, product) => {
                const quantity = quantities[product.productId];
                const price = parseFloat(product.lowPrice);
                return total + quantity * price;
            }, 0)
            .toLocaleString();
    };

    const handleCheckboxChange = (productId: number) => {
        setCheckedProducts((prevCheckedProducts) => ({
            ...prevCheckedProducts,
            [productId]: !prevCheckedProducts[productId],
        }));
        const isChecked = !checkedProducts[productId];
        const product = products.find((product) => product.productId === productId);
        if (isChecked && product) {
            setSelectedProducts((prevSelectedProducts) =>
                prevSelectedProducts.some((p) => p.productId === productId)
                    ? prevSelectedProducts.map((p) =>
                        p.productId === productId
                            ? { ...p, count: quantities[productId] }
                            : p
                    )
                    : [...prevSelectedProducts, { ...product, count: quantities[productId] }]
            );
        } else {
            setSelectedProducts((prevSelectedProducts) =>
                prevSelectedProducts.filter((p) => p.productId !== productId)
            );
        }
    };


    const handleAllCheckboxChange = () => {
        const newIsAllChecked = !isAllChecked;
        setIsAllChecked(newIsAllChecked);

        const newCheckedProducts: { [key: number]: boolean } = {};
        const newSelectedProducts: Product[] = [];

        products.forEach((product) => {
            newCheckedProducts[product.productId] = newIsAllChecked;
            if (newIsAllChecked) {
                newSelectedProducts.push(product);
            }
        });

        setCheckedProducts(newCheckedProducts);
        setSelectedProducts(newSelectedProducts);
    };

    const decrementQuantity = (productId: number) => {
        const currentQuantity = parseInt(quantities[productId].toString(), 10); // 정수로 변환
        if (currentQuantity > 1) {
            const updatedQuantities = {
                ...quantities,
                [productId]: currentQuantity - 1,
            };
            setQuantities(updatedQuantities);

            setSelectedProducts((prevSelectedProducts) =>
                prevSelectedProducts.map((p) =>
                    p.productId === productId ? { ...p, count: currentQuantity - 1 } : p
                )
            );
        }
    };


    const incrementQuantity = (productId: number) => {
        const currentQuantity = parseInt(quantities[productId]?.toString() || "0", 10); // 정수로 변환
        const updatedQuantities = {
            ...quantities,
            [productId]: currentQuantity + 1,
        };
        setQuantities(updatedQuantities);

        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.map((p) =>
                p.productId === productId ? { ...p, count: currentQuantity + 1 } : p
            )
        );
    };

    const handleCheckout = () => {
        const selectedProductIds = selectedProducts.map((product) => product.productId);
        const totalPrice = selectedProducts
            .reduce((total, product) => {
                const quantity = quantities[product.productId];
                const price = parseFloat(product.lowPrice);
                return total + quantity * price;
            }, 0)
            .toLocaleString();

        if (selectedProducts.length === 0) {
            alert("상품을 선택해주세요.");
            return;
        }

        navigate("/address", {
            state: { selectedProducts, selectedProductIds, totalPrice },
        });
    };


    const calculateProductTotalPrice = (product: Product) => {
        const quantity = quantities[product.productId] || 1;
        const price = parseFloat(product.lowPrice);
        return (quantity * price).toLocaleString();
    };

    return (
        <div className="container">
            <div>
                <h3>장바구니</h3>
            </div>
            {products.length === 0 ? (
                <table className="table">
                    <thead>
                        <tr className="head">
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleAllCheckboxChange}
                                />
                            </th>
                            <th></th>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>가격</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{
                                    width: "1100px",
                                    display: "flex",
                                    height: "76px",
                                    textAlign: "center",
                                    fontSize: "24px",
                                    color: "rgba(0, 0, 0, 0.4)",
                                    fontWeight: "500",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    장바구니에 담긴 상품이 없습니다.
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot style={{ alignItems: 'center' }}>
                        <tr style={{ width: '100%', textAlign: 'center' }}>
                            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                총 가격: {calculateTotalPrice()} 원
                            </td>
                            <td>
                                <button style={{ width: "110px" }} className="cart-list-buy" onClick={handleCheckout}>구매하기</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <table className="table">
                    <thead>
                        <tr className="head">
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleAllCheckboxChange}
                                />
                            </th>
                            <th></th>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>가격</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {products.map((product) => (
                            <tr key={product.productId}>
                                <td className="checkbox" style={{ verticalAlign: "middle" }}>
                                    <input
                                        type="checkbox"
                                        checked={checkedProducts[product.productId] || false}
                                        onChange={() => handleCheckboxChange(product.productId)}
                                    />
                                </td>
                                <td>
                                    {product.productImageList && product.productImageList.map((image) => (
                                        <img key={image} className="product-detail-main-image" src={image} />
                                    ))}
                                </td>
                                <td>
                                    <a href={`/product/detail/${product.productId}`} target="_blank" rel="noopener noreferrer">
                                        {product.title}
                                    </a>
                                </td>
                                <td>
                                    <div className="cart-quantity-wrapper">
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
                                </td>
                                <td>{calculateProductTotalPrice(product)} 원</td>
                                <td>
                                    <div className="icon-button">
                                        <div
                                            className="icon close-icon"
                                            onClick={() =>
                                                deleteButtonClickHandler(product.productId)
                                            }
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot style={{ alignItems: 'center' }}>
                        <tr style={{ width: '100%', textAlign: 'center' }}>
                            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                총 가격: {calculateTotalPrice()} 원
                            </td>
                            <td>
                                <button style={{ width: "110px" }} className="cart-list-buy" onClick={handleCheckout}>구매하기</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
};

export default CartList;

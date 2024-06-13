import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DeleteProductRequest, GetProductListRequest } from 'apis';
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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [checkedProducts, setCheckedProducts] = useState<{ [key: number | string]: boolean }>({});
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (loginUser?.userId) {
            setUserId(loginUser.userId);
            setIsLoggedIn(true);
        }
    }, [loginUser]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (userId && cookies.accessToken) {
                    const response = await GetProductListRequest(userId, cookies.accessToken);
                    setProducts(response.data.items);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, [userId, cookies.accessToken]);

    const deleteButtonClickHandler = async (productId: number) => {
        alert('삭제하시겠습니까?');
        if (userId && cookies.accessToken) {
            const response = await DeleteProductRequest(productId, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                alert('삭제되었습니다.');
                const newProducts = products.filter(product => product.productId !== productId);
                setProducts(newProducts);
            } else {
                alert('삭제에 실패했습니다.');
            }
        }
    }

    const formatPrice = (price: string) => {
        return parseFloat(price).toLocaleString();
    };

    const calculateTotalPrice = () => {
        return Object.keys(checkedProducts)
            .filter(productId => checkedProducts[productId])
            .reduce((total, productId) => {
                const product = products.find(product => product.productId === parseInt(productId));
                return total + (product ? parseFloat(product.lowPrice) : 0);
            }, 0).toLocaleString();
    };

    const handleCheckboxChange = (productId: number) => {
        setCheckedProducts(prevCheckedProducts => ({
            ...prevCheckedProducts,
            [productId]: !prevCheckedProducts[productId]
        }));
        if (!checkedProducts[productId]) {
            const selectedProduct = products.find(product => product.productId === productId);
            if (selectedProduct) {
                setSelectedProducts(prevSelectedProducts => [...prevSelectedProducts, selectedProduct]);
            }
        } else {
            setSelectedProducts(prevSelectedProducts => prevSelectedProducts.filter(product => product.productId !== productId));
        }
    };

    const handleAllCheckboxChange = () => {
        const newIsAllChecked = !isAllChecked;
        setIsAllChecked(newIsAllChecked);

        const newCheckedProducts: { [key: number | string]: boolean } = {};
        const newSelectedProducts: Product[] = [];

        products.forEach(product => {
            newCheckedProducts[product.productId] = newIsAllChecked;
            if (newIsAllChecked) {
                newSelectedProducts.push(product);
            }
        });

        setCheckedProducts(newCheckedProducts);
        setSelectedProducts(newSelectedProducts);
    };


    const handleCheckout = () => {
        const selectedProductIds = selectedProducts.map(product => product.productId);
        navigate('/address', {
            state: { selectedProducts, selectedProductIds }
        });
    };

    return (
        <div className="container">
            <div>
                <h2>Product List</h2>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllChecked}
                                onChange={handleAllCheckboxChange}
                            />
                        </th>
                        <th></th>
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
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedProducts[product.productId] || false}
                                    onChange={() => handleCheckboxChange(product.productId)}
                                />
                            </td>
                            <td><img src={product.image} alt={product.title} width="100" /></td>
                            <td>{product.productId}</td>
                            <td>
                                <a href={product.link} target="_blank" rel="noopener noreferrer">{product.title}</a>
                            </td>
                            <td>{formatPrice(product.lowPrice)} 원</td>
                            <td>{product.category1}/{product.category2}</td>
                            <td>
                                <div>
                                    <button className="mt-[5px] btn btn-warning" onClick={() => deleteButtonClickHandler(product.productId)}>삭제</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'right',fontWeight: 'bold' }}>
                            총 가격: {calculateTotalPrice()} 원
                        </td>
                        <td colSpan={7} style={{}}>
                            <button className="mt-[5px] btn btn-warning" onClick={handleCheckout}>구매하기</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default CartList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import GetProductInformationRequestDto from 'apis/request/product/get-product.request.dto';
import GetReviewListResponseDto from "apis/response/product/get-review-list.response.dto";



export default function productInfo() {
    const { productId } = useParams();
    const [ product, setProduct] = useState<GetProductInformationRequestDto>();
    const [ review, setReview] = useState<GetReviewListResponseDto>();



    function hello () {}

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await axios.post(`http://api.example.com/entities`, productId);
                setProduct(productData.data);
                const reviewList = await axios.post(`http://api.example.com/entities`, productId);
                setReview(reviewList.data);
            } catch(error) {
                console.error(error);
            }
        };
        fetchData();
    }, [productId]);

    if(!product)
        return (<div></div>);
    
    return(
        <div className="product-information-container">
            <div>
                <h2>Product information</h2>
            </div>
            <div className="product-information-box">
                <div className="product-information"> 
                    <div>상품 이름, 이미지
                        {product.title}
                        <img src={product.image}/>
                    </div>
                    <p>{product.lowPrice}</p>
                </div>

                <button onClick={hello}>구매 버튼</button>

                <div className='review-container'>
                    <ul>
                        <li>
                        </li>
                    </ul>
                </div>

                <div className=''>
                    다른 상품 보기
                </div>
            </div>
        </div>
    );
}

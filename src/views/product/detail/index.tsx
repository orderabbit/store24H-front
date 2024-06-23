import { DeleteProductRequest, GetProductRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { DeleteProductResponseDto, GetProductResponseDto } from 'apis/response/product';
import { MAIN_PATH, UPDATE_PATH } from 'constant';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { Product } from 'types/interface';
import './style.css';

export default function Detail() {

    const { Number } = useParams();
    const { loginUser } = useLoginUserStore();
    const [showMore, setShowMore] = useState<boolean>(false);
    const [cookies, setCookies] = useCookies();
    const [isUser, setUser] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);

    const navigator = useNavigate();

    const onMoreButtonClickHandler = () => {
        setShowMore(!showMore);
    };

    const getWriteDatetimeFormat = () => {
        if (!product) return "";
        const date = dayjs(product.writeDatetime);
        return date.format("YYYY. MM. DD.");
    };

    const getProductResponse = (primaryResponse: GetProductResponseDto | ResponseDto | null, secondaryResponse: GetProductResponseDto | ResponseDto | null) => {
        if (!primaryResponse || !secondaryResponse) return;

        const primaryBody = primaryResponse as GetProductResponseDto;
        const secondaryBody = secondaryResponse as GetProductResponseDto;

        const { code: primaryCode } = primaryBody;
        const { code: secondaryCode } = secondaryBody;

        if (primaryCode === "NB" || secondaryCode === "NB") {
            alert("존재하지 않습니다.");
            navigator(MAIN_PATH());
            return;
        }
        if (primaryCode === "DBE" || secondaryCode === "DBE") {
            alert("데이터베이스 오류입니다.");
            navigator(MAIN_PATH());
            return;
        }
        if (primaryCode !== "SU" || secondaryCode !== "SU") {
            return;
        }

        const product: Product = { ...(primaryBody as GetProductResponseDto) };
        product.secondaryProductImageList = (secondaryBody as GetProductResponseDto).secondaryProductImageList;
        setProduct(product);
        console.log(product);

        if (!loginUser) {
            setUser(false);
            return;
        }
        const isUser = loginUser.userId === product.userId;
        setUser(isUser);
    };

    const deleteProductResponse = (responseBody: DeleteProductResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === "VF") alert("잘못된 접근입니다.");
        if (code === "NU") alert("존재하지 않는 유저입니다.");
        if (code === "NB") alert("존재하지 않습니다.");
        if (code === "NP") alert("권한이 없습니다.");
        if (code === "DBE") alert("데이터베이스 오류입니다.");
        if (code !== "SU") return;

        alert("삭제되었습니다.");
        navigator(MAIN_PATH());
    };

    const onUpdateButtonClickHandler = () => {
        if (!product || !loginUser) return;
        if (loginUser.userId !== product.userId) return;
        navigator(UPDATE_PATH(product.productId));
    };

    const onDeleteButtonClickHandler = () => {
        if (!Number || !product || !loginUser || !cookies.accessToken) return;
        if (loginUser.userId !== product.userId) return;

        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }
        DeleteProductRequest(Number, cookies.accessToken).then(deleteProductResponse);
    };

    useEffect(() => {
        if (!Number) {
            navigator(MAIN_PATH());
            return;
        }
        Promise.all([
            GetProductRequest(Number, 'primary'),
            GetProductRequest(Number, 'secondary')
        ])
            .then(([primaryResponse, secondaryResponse]) => {
                getProductResponse(primaryResponse, secondaryResponse);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [Number]);


    if (!product) return <></>;
    return (
        <div id="product-detail-wrapper">
            <div className="product-detail-container">
                <div className="product-top-header">
                    <div className="product-detail-top-sub-box">
                    {isUser && (
                        <button onClick={onMoreButtonClickHandler}>{'more'}</button>
                    )}
                    {showMore && (
                        <div className="product-detail-more-box">
                            <div
                                className="product-detail-update-button"
                                onClick={onUpdateButtonClickHandler}
                            >
                                {"수정"}
                            </div>
                            <div className="divider"></div>
                            <div
                                className="product-detail-delete-button"
                                onClick={onDeleteButtonClickHandler}
                            >
                                {"삭제"}
                            </div>
                        </div>
                    )}
                    </div>
                    <div className="product-detail-write-date">{getWriteDatetimeFormat()}</div>
                </div>
                <div className="detail-top-content">
                    <div className="product-detail-thumbnail">
                        {product.productImageList.map((image) => (
                        <img key={image} className="product-detail-main-image" src={image} />
                        ))}
                    </div>
                    <div className="product-detail-info">
                        <div className="product-detail-title">{product.title}</div>
                        <div className="product-detail-main-text">{product.content}</div>
                        <div className="product-detail-lowPrice">{product.lowPrice} 원</div>
                        <div className="divider"></div>
                        <div>등록자 : {product.userId}</div>
                        <div className="product-detail-imagebar">
                        {product.productImageList.map((image) => (
                        <img key={image} className="product-detail-imagebar" src={image} />
                        ))}
                        {product.secondaryProductImageList && product.secondaryProductImageList.map((image) => (
                        <img key={image} className="product-detail-imagebar" src={image} />
                        ))}
                        </div>
                    </div>
                </div>
                <div className="detail-middle-content">
                    <div className="product-detail-image">
                        {product.secondaryProductImageList && product.secondaryProductImageList.map((image) => (
                        <img key={image} className="product-detail-middle-image" src={image} />
                        ))}
                    </div>
                </div>
                <div className="detail-bottom-content">
                    {/* 여기에 하단 댓글,문의등 함수 top: 상품정보 middle : 상품 사진나열, bottom: 댓글,문의 등등 */}
                </div>
            </div>
        </div>
    )
}

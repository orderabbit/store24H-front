import { PatchProductRequest, PostProductRequest, fileUploadRequest } from 'apis';
import { PatchProductRequestDto, PostProductRequestDto } from 'apis/request/product';
import { ResponseDto } from 'apis/response';
import { PatchProductResponseDto, PostProductResponseDto } from 'apis/response/product';
import { MAIN_PATH, SIGNIN_PATH, USER_PATH } from 'constant';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import useProductStore from 'stores/product.store';
import uploadPhotoIcon from '../../../images/free-icon-camera-15629883.png';
import './style.css';

export default function Write() {

    const productIdRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLInputElement | null>(null);
    const lowPriceRef = useRef<HTMLInputElement | null>(null);
    const category1Ref = useRef<HTMLSelectElement | null>(null);
    const category2Ref = useRef<HTMLSelectElement | null>(null);
    const category3Ref = useRef<HTMLSelectElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const secondaryImageInputRef = useRef<HTMLInputElement | null>(null);
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    const { productId, setProductId } = useProductStore();
    const { title, setTitle } = useProductStore();
    const { content, setContent } = useProductStore();
    const { lowPrice, setLowPrice } = useProductStore();
    const { category1, setCategory1 } = useProductStore();
    const { category2, setCategory2 } = useProductStore();
    const { category3, setCategory3 } = useProductStore();
    const { productImageFileList, setProductImageFileList } = useProductStore();
    const { secondaryProductImageFileList, setSecondaryProductImageFileList } = useProductStore();
    const { resetProduct } = useProductStore();

    const [cookies, setCookies] = useCookies();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [secondaryImageUrls, setSecondaryImageUrls] = useState<string[]>([]);


    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            navigate(MAIN_PATH());
            return;
        }
        resetProduct();
    }, []);

    const onProductIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setProductId(parseInt(value, 10));

        if (!productIdRef.current) return;
        productIdRef.current.style.height = 'auto';
        productIdRef.current.style.height = `${productIdRef.current.scrollHeight}px`;
    };

    const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTitle(value);

        if (!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    const onContentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setContent(value);

        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    };

    const onLowPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setLowPrice(value);

        if (!lowPriceRef.current) return;
        lowPriceRef.current.style.height = 'auto';
        lowPriceRef.current.style.height = `${lowPriceRef.current.scrollHeight}px`;
    };

    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = productImageFileList.map(item => item);
        newBoardImageFileList.push(file);
        setProductImageFileList(newBoardImageFileList);

        if (!imageInputRef.current) return;
        imageInputRef.current.value = '';
    }

    const onImageUploadButtonClickHandler = () => {
        if (!imageInputRef.current) return;
        setImageUrls([]);
        setProductImageFileList([]);
        imageInputRef.current.click();
    }

    const onImageCloseButtonClickHandler = (deleteindex: number) => {
        if (!imageInputRef.current) return;
        imageInputRef.current.value = "";

        const newImageUrls = imageUrls.filter((url, index) => index !== deleteindex);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = productImageFileList.filter((file, index) => index !== deleteindex);
        setProductImageFileList(newBoardImageFileList);
    }

    const onSecondaryImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = secondaryImageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setSecondaryImageUrls(newImageUrls);

        const newSecondaryImageFileList = secondaryProductImageFileList.map(item => item);
        newSecondaryImageFileList.push(file);
        setSecondaryProductImageFileList(newSecondaryImageFileList);

        if (!secondaryImageInputRef.current) return;
        secondaryImageInputRef.current.value = '';
    }

    const onSecondaryImageUploadButtonClickHandler = () => {
        if (!secondaryImageInputRef.current) return;
        secondaryImageInputRef.current.click();
    }

    const onSecondaryImageCloseButtonClickHandler = (deleteIndex: number) => {
        if (!secondaryImageInputRef.current) return;
        secondaryImageInputRef.current.value = "";

        const newImageUrls = secondaryImageUrls.filter((url, index) => index !== deleteIndex);
        setSecondaryImageUrls(newImageUrls);

        const newSecondaryImageFileList = secondaryProductImageFileList.filter((file, index) => index !== deleteIndex);
        setSecondaryProductImageFileList(newSecondaryImageFileList);
    }

    const UploadButton = () => {

        const { title, content, lowPrice, category1, category2, category3 } = useProductStore();

        const postBoardResponse = (responseBody: PostProductResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'AF' || code === 'NU') navigate(SIGNIN_PATH());
            if (code === 'VF') alert('모두 입력하세요.');
            if (code === 'DPI') alert('중복된 상품번호입니다.');
            if (code !== 'SU') return;
            resetProduct();
            if (!loginUser) return;

            alert('등록되었습니다.');
            navigate(MAIN_PATH());
        }

        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            const productImageList: string[] = [];
            const secondaryProductImageList: string[] = [];
            let image = "";

            for (const file of productImageFileList) {
                const data = new FormData();
                data.append('file', file);

                const url = await fileUploadRequest(data);
                if (url) productImageList.push(url);
            }

            for (const file of secondaryProductImageFileList) {
                const data = new FormData();
                data.append('file', file);

                const url = await fileUploadRequest(data);
                if (url) secondaryProductImageList.push(url);
            }

            if (productImageList.length > 0) {
                image = productImageList[0];
            }
            const requestBody: PostProductRequestDto = {
                productId, title, content, lowPrice, category1, category2, category3, productImageList, secondaryProductImageList
            }
            PostProductRequest(requestBody, accessToken).then(postBoardResponse);
        }

        if (title && content && productImageFileList.length > 0)
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        return <div className='disable-button'>{'업로드'}</div>;
    }

    const categoryOptions: Record<string, Record<string, string[]>> = {
        "식품": {
            "음료": ["커피", "탄산음료", "에너지음료", "기타음료"],
            "음식": ["냉장/냉동", "과일/채소"],
            "과자": ["과자", "젤리", "초콜릿", "사탕"]
        },
        "생활용품": {
            "욕실용품": ["샴푸", "칫솔"],
            "의료용품": ["감기약", "멀미약"],
            "청소용품": ["비누", "세제", "솔", "휴지"]
        },
        "문구": {
            "필기용품": ["색연필", "연필", "지우개", "볼펜"]
        }
        // Add more options as needed
    };

    const onCategory1ChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setCategory1(value);
        if (value) {
            setCategoryOptions2(Object.keys(categoryOptions[value] || {}));
            setCategoryOptions3([]);
        } else {
            setCategoryOptions2([]);
            setCategoryOptions3([]);
        }
    };

    const onCategory2ChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setCategory2(value);
        if (category1) {
            setCategoryOptions3(categoryOptions[category1][value] || []);
        } else {
            setCategoryOptions3([]);
        }
    };

    const onCategory3ChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setCategory3(value);
    };


    const [categoryOptions2, setCategoryOptions2] = useState<string[]>([]);
    const [categoryOptions3, setCategoryOptions3] = useState<string[]>([]);

    return (
        <div id='product-write-wrapper'>
            <div className='product-write-container'>
                <h2 className='write-product-title'>상품 등록</h2>
                <ul className='product-write-box'>
                    <li className='product-write-title-box'>
                        <div>상품번호</div>
                        <div className='product-write-content-box'>
                            <input ref={productIdRef} className='product-write-content-inputarea' placeholder='상품번호를 입력해주세요' value={productId} onChange={onProductIdChangeHandler} />
                        </div>
                    </li>
                    <li className='product-write-title-box'>
                        <div>상품명</div>
                        <div className='product-write-content-box'>
                            <input ref={titleRef} className='product-write-content-inputarea' placeholder='상품명을 입력해주세요' value={title} onChange={onTitleChangeHandler} />
                        </div>
                    </li>
                    <li className='product-write-icon-box'>
                        <div>상품이미지</div>
                        <div className='product-write-content-box'>
                            <div className='product-write-content-image-button'>
                                <button onClick={onImageUploadButtonClickHandler}>
                                    <img src={uploadPhotoIcon} alt="대표 이미지 등록" className="icon" />
                                    {'대표 이미지 등록'}
                                </button>
                                <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
                                <button onClick={onSecondaryImageUploadButtonClickHandler}>
                                    <img src={uploadPhotoIcon} alt="대표 이미지 등록" className="icon" />
                                    {'이미지 등록'}
                                </button>
                                <input ref={secondaryImageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onSecondaryImageChangeHandler} />
                            </div>
                        </div>
                    </li>
                    <div className='product-write-images-box'>
                        {imageUrls.map((imageUrl, index) =>
                            <div className='product-write-image-box' key={index}>
                                <div className="representative-image-label">대표 이미지</div>
                                <img className='product-write-image' src={imageUrl} />
                                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                        {secondaryImageUrls.map((imageUrl, index) =>
                            <div className='product-write-image-box' key={index}>
                                <img className='product-write-image' src={imageUrl} />
                                <div className='icon-button image-close' onClick={() => onSecondaryImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <li className='product-write-title-box'>
                        <div>상품설명</div>
                        <div className='product-write-content-box'>
                            <input ref={contentRef} className='product-write-content-inputarea' placeholder='상품을 설명해주세요' value={content} onChange={onContentChangeHandler} />
                        </div>
                    </li>
                    <li className='product-write-title-box'>
                        <div>가격</div>
                        <div className='product-write-content-box'>
                            <input ref={lowPriceRef} className='product-write-content-inputarea-price' placeholder='가격을 입력해주세요' value={lowPrice} onChange={onLowPriceChangeHandler} />
                        </div>
                    </li>
                    <li className='product-write-title-box'>
                        <div>카테고리</div>
                        <div className='product-write-content-box'>
                            <select ref={category1Ref} className='product-write-content-select' value={category1} onChange={onCategory1ChangeHandler}>
                                <option value=''>카테고리를 선택해주세요</option>
                                {Object.keys(categoryOptions).map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            <select ref={category2Ref} className='product-write-content-select' value={category2} onChange={onCategory2ChangeHandler}>
                                <option value=''>카테고리를 선택해주세요</option>
                                {categoryOptions2.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            <select ref={category3Ref} className='product-write-content-select' value={category3} onChange={onCategory3ChangeHandler}>
                                <option value=''>카테고리를 선택해주세요</option>
                                {categoryOptions3.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </li>
                </ul>
                <div className='upload-button'>{<UploadButton />}</div>
            </div>
        </div>
    );
}


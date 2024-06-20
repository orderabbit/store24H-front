import { GetProductRequest, PatchProductRequest, PostProductRequest, fileUploadRequest } from 'apis';
import { PatchProductRequestDto, PostProductRequestDto } from 'apis/request/product';
import { ResponseDto } from 'apis/response';
import { GetProductResponseDto, PatchProductResponseDto, PostProductResponseDto } from 'apis/response/product';
import { DETAIL_PATH, MAIN_PATH, SIGNIN_PATH, USER_PATH, WRITE_PATH } from 'constant';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import useProductStore from 'stores/product.store';
import uploadPhotoIcon from '../../../images/free-icon-camera-15629883.png';
import './style.css';
import { convertUrlsToFile } from 'utils';

export default function Update() {

    const productIdRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentRef = useRef<HTMLInputElement | null>(null);
    const lowPriceRef = useRef<HTMLInputElement | null>(null);
    const category1Ref = useRef<HTMLInputElement | null>(null);
    const category2Ref = useRef<HTMLInputElement | null>(null);
    const category3Ref = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const secondaryImageInputRef = useRef<HTMLInputElement | null>(null);

    const ProductId = Number(useParams()["Number"]);

    const { pathname } = useLocation();
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
        if (!ProductId) {
            navigate(MAIN_PATH());
            return;
        }
        Promise.all([
            GetProductRequest(ProductId, 'primary'),
            GetProductRequest(ProductId, 'secondary')
        ])
            .then(([primaryResponse, secondaryResponse]) => {
                getProductResponse(primaryResponse, secondaryResponse);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [Number]);



    const getProductResponse = (primaryResponse: GetProductResponseDto | ResponseDto | null, secondaryResponse: GetProductResponseDto | ResponseDto | null) => {
        if (!primaryResponse || !secondaryResponse) return;

        const primaryBody = primaryResponse as GetProductResponseDto;
        const secondaryBody = secondaryResponse as GetProductResponseDto;

        const { code: primaryCode } = primaryBody.data;
        const { code: secondaryCode } = secondaryBody.data;

        if (primaryCode === 'NB' || secondaryCode === 'NB') {
            alert('존재하지 않습니다.');
            navigate(MAIN_PATH());
            return;
        }
        if (primaryCode === 'DBE' || secondaryCode === 'DBE') {
            alert('데이터베이스 오류입니다.');
            navigate(MAIN_PATH());
            return;
        }
        if (primaryCode !== 'SU' || secondaryCode !== 'SU') {
            return;
        }
        const { productId, title, content, lowPrice, category1, category2, category3, productImageList, secondaryProductImageList, userId } = primaryBody;

        setProductId(productId);
        setTitle(title);
        setContent(content);
        setLowPrice(lowPrice);
        setCategory1(category1);
        setCategory2(category2);
        setCategory3(category3);
        setImageUrls(productImageList);
        convertUrlsToFile(productImageList).then(productImageFileList => setProductImageFileList(productImageFileList));
        convertUrlsToFile(secondaryProductImageList).then(secondaryProductImageFileList => setSecondaryProductImageFileList(secondaryProductImageFileList));


        if (!loginUser || loginUser.userId !== userId) {
            alert('권한이 없습니다.');
            navigate(MAIN_PATH());
            return;
        }
    };

    const onProductIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setProductId(value);

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

    const onCategory1ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCategory1(value);

        if (!category1Ref.current) return;
        category1Ref.current.style.height = 'auto';
        category1Ref.current.style.height = `${category1Ref.current.scrollHeight}px`;
    };

    const onCategory2ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCategory2(value);

        if (!category2Ref.current) return;
        category2Ref.current.style.height = 'auto';
        category2Ref.current.style.height = `${category2Ref.current.scrollHeight}px`;
    };

    const onCategory3ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCategory3(value);

        if (!category3Ref.current) return;
        category3Ref.current.style.height = 'auto';
        category3Ref.current.style.height = `${category3Ref.current.scrollHeight}px`;
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

        const { title, content, lowPrice, category1, category2 } = useProductStore();

        const patchBoardResponse = (responseBody: PatchProductResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody.data;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(SIGNIN_PATH());
            if (code === 'VF') alert('모두 입력하세요.');
            if (code !== 'SU') return;

            if (!productId) return;
            alert('수정되었습니다.');
            navigate(DETAIL_PATH(productId));
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

            if (!productId) {
                alert('존재하지 않는 상품입니다.');
            } else {
                const requestBody: PatchProductRequestDto = { productId, title, content, image, lowPrice, category1, category2, category3, productImageList, secondaryProductImageList }
                PatchProductRequest(productId, requestBody, accessToken).then(patchBoardResponse);
            }
        }

        if (title && content && productImageFileList.length > 0)
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        return <div className='disable-button'>{'업로드'}</div>;
    }

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
                            <input ref={category1Ref} className='product-write-content-inputarea' placeholder='category1' value={category1} onChange={onCategory1ChangeHandler} />
                            <input ref={category2Ref} className='product-write-content-inputarea' placeholder='category2' value={category2} onChange={onCategory2ChangeHandler} />
                            <input ref={category3Ref} className='product-write-content-inputarea' placeholder='category3' value={category3} onChange={onCategory3ChangeHandler} />
                        </div>
                    </li>
                </ul>
                <div className='upload-button'>{<UploadButton />}</div>
            </div>
        </div>
    );
}


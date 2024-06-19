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
import './style.css';
import { convertUrlsToFile } from 'utils';

export default function Update() {

    const productIdRef = useRef<HTMLTextAreaElement | null>(null);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const lowPriceRef = useRef<HTMLTextAreaElement | null>(null);
    const category1Ref = useRef<HTMLTextAreaElement | null>(null);
    const category2Ref = useRef<HTMLTextAreaElement | null>(null);
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
        const { productId, title, content, lowPrice, category1, category2, productImageList, secondaryProductImageList, userId } = primaryBody;

        setProductId(productId);
        setTitle(title);
        setContent(content);
        setLowPrice(lowPrice);
        setCategory1(category1);
        setCategory2(category2);
        setImageUrls(productImageList);
        convertUrlsToFile(productImageList).then(productImageFileList => setProductImageFileList(productImageFileList));
        convertUrlsToFile(secondaryProductImageList).then(secondaryProductImageFileList => setSecondaryProductImageFileList(secondaryProductImageFileList));
        

        if (!loginUser || loginUser.userId !== userId) {
            alert('권한이 없습니다.');
            navigate(MAIN_PATH());
            return;
        }
    };

    const onProductIdChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setProductId(value);

        if (!productIdRef.current) return;
        productIdRef.current.style.height = 'auto';
        productIdRef.current.style.height = `${productIdRef.current.scrollHeight}px`;
    };

    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setTitle(value);

        if (!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);

        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    };

    const onLowPriceChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setLowPrice(value);

        if (!lowPriceRef.current) return;
        lowPriceRef.current.style.height = 'auto';
        lowPriceRef.current.style.height = `${lowPriceRef.current.scrollHeight}px`;
    };

    const onCategory1ChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setCategory1(value);

        if (!category1Ref.current) return;
        category1Ref.current.style.height = 'auto';
        category1Ref.current.style.height = `${category1Ref.current.scrollHeight}px`;
    };

    const onCategory2ChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setCategory2(value);

        if (!category2Ref.current) return;
        category2Ref.current.style.height = 'auto';
        category2Ref.current.style.height = `${category2Ref.current.scrollHeight}px`;
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
        const postBoardResponse = (responseBody: PostProductResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody.data;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'AF' || code === 'NU') navigate(SIGNIN_PATH());
            if (code === 'VF') alert('모두 입력하세요.');
            if (code !== 'SU') return;
            resetProduct();
            if (!loginUser) return;

            alert('등록되었습니다.');
            navigate(MAIN_PATH());
        }

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

            const isWritePage = pathname === WRITE_PATH();
            if (isWritePage) {
                const requestBody: PostProductRequestDto = {
                    productId, title, content, image, lowPrice, category1, category2, productImageList, secondaryProductImageList
                }
                console.log(requestBody);
                PostProductRequest(requestBody, accessToken).then(postBoardResponse);
            } else {
                if (!productId) {
                    alert('존재하지 않는 상품입니다.');
                } else {
                    const requestBody: PatchProductRequestDto = { productId, title, content, image, lowPrice, category1, category2, productImageList, secondaryProductImageList }
                    PatchProductRequest(productId, requestBody, accessToken).then(patchBoardResponse);
                }
            }
        }

        if (title && content && productImageFileList.length > 0)
            return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        return <div className='disable-button'>{'업로드'}</div>;
    }

    return (
        <div id='product-update-wrapper'>
            <div className='product-update-container'>
                <div className='product-update-box'>
                    <div className='product-update-title-box'>
                        <textarea ref={productIdRef} className='product-update-title-textarea' rows={1} placeholder='productId' value={productId} onChange={onProductIdChangeHandler} />
                    </div>
                    <div className='product-update-title-box'>
                        <textarea ref={titleRef} className='product-update-title-textarea' rows={1} placeholder='title' value={title} onChange={onTitleChangeHandler} />
                    </div>
                    <div className='product-update-content-box'>
                        <textarea ref={contentRef} className='product-update-content-textarea' placeholder='content' value={content} onChange={onContentChangeHandler} />
                    </div>
                    <div className='product-update-title-box'>
                        <textarea ref={lowPriceRef} className='product-update-title-textarea' rows={1} placeholder='lowPrice' value={lowPrice} onChange={onLowPriceChangeHandler} />
                    </div>
                    <div className='product-update-title-box'>
                        <textarea ref={category1Ref} className='product-update-title-textarea' rows={1} placeholder='category1' value={category1} onChange={onCategory1ChangeHandler} />
                    </div>
                    <div className='product-update-title-box'>
                        <textarea ref={category2Ref} className='product-update-title-textarea' rows={1} placeholder='category2' value={category2} onChange={onCategory2ChangeHandler} />
                    </div>

                    <div className='product-update-icon-box'>
                        <button onClick={onImageUploadButtonClickHandler}>{'메인'}</button>
                        <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
                        <button onClick={onSecondaryImageUploadButtonClickHandler}>{'상세정보'}</button>
                        <input ref={secondaryImageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onSecondaryImageChangeHandler} />
                    </div>
                    <div className='product-update-images-box'>
                        {imageUrls.map((imageUrl, index) =>
                            <div className='product-update-image-box' key={index}>
                                <img className='product-update-image' src={imageUrl} />
                                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='product-update-images-box'>
                        {secondaryImageUrls.map((imageUrl, index) =>
                            <div className='product-update-image-box' key={index}>
                                <img className='product-update-image' src={imageUrl} />
                                <div className='icon-button image-close' onClick={() => onSecondaryImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>{<UploadButton />}</div>
            </div>
        </div>
    );
}


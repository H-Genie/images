import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import Image from './Image';
import './ImageList.css';

const ImageList = () => {
    const {
        images,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl
    } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const elementRef = useRef(null);

    const loadMoreImages = useCallback(() => {
        if (images.length === 0 || imageLoading) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(`${isPublic ? "" : "users/me"}/images?lastid=${lastImageId}`);
    }, [images, imageLoading, isPublic, setImageUrl]);

    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) loadMoreImages();
        });

        observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [loadMoreImages]);

    const imgList = images.map((image, index) => (
        <Link to={`/images/${image._id}`} key={index} ref={index + 1 === images.length ? elementRef : undefined}>
            <Image imageUrl={`https://d3tzguf70ce0ti.cloudfront.net/w140/${image.key}`} />
        </Link>
    ));

    return (
        <div>
            <h3 style={{ display: 'inline-block', marginRight: 10 }}>
                Image List ({isPublic ? "공개" : "개인"} 사진)
            </h3>

            {me && <button onClick={() => setIsPublic(!isPublic)}>{(isPublic ? "개인" : "공개") + "사진 보기"}</button>}

            <div className='image-list-container'>{imgList}</div>

            {imageError && <div>Error...</div>}

            {imageLoading && <div>Loading...</div>}
        </div>
    )
}

export default ImageList;
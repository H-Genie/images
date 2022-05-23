import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import './ImageList.css';

const ImageList = () => {
    const {
        images,
        myImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
        imageLoading,
        imageError
    } = useContext(ImageContext);
    const [me] = useContext(AuthContext);

    const imgList = (isPublic ? images : myImages).map(image => (
        <Link to={`/images/${image._id}`} key={image.key}>
            <img
                src={`http://localhost:3000/uploads/${image.key}`}
                alt={image.key}
            />
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

            {
                imageLoading ?
                    <div>Loading...</div> :
                    <button onClick={loadMoreImages}>Load More Images</button>
            }
        </div>
    )
}

export default ImageList;
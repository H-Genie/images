import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';

const ImagePage = () => {
    const { imageId } = useParams();
    const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
    const [hasLiked, setHasLiked] = useState(false);
    const [me] = useContext(AuthContext);
    let navigate = useNavigate();

    const image = images.find(image => image._id === imageId) || myImages.find(image => image._id === imageId);

    useEffect(() => {
        if (me && image.likes.includes(me.userId)) setHasLiked(true);
    }, [me, image]);

    if (!image) return <h3>Loading...</h3>;

    const updateImage = (images, image) => [
        ...images.filter(image => image._id !== imageId), image
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());


    const onSubmit = async () => {
        const result = await axios.patch(`/images/${imageId}/${hasLiked ? 'unlike' : 'like'}`);

        if (result.data.public) setImages(updateImage(images, result.data));
        else setMyImages(updateImage(myImages, result.data));

        setHasLiked(!hasLiked);
    }

    const deleteHandler = async () => {
        try {
            if (!window.confirm("삭제하시겠습니까?")) return;

            const result = await axios.delete(`/images/${imageId}`);
            toast.success(result.data.message);

            setImages(images.filter(image => image._id !== imageId));
            setMyImages(myImages.filter(image => image._id !== imageId));

            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div>
            <h3>Image Page - {imageId}</h3>
            <img
                alt={imageId}
                src={`http://localhost:5000/uploads/${image.key}`}
                style={{ width: '100%' }}
            />

            <span>좋아요 {image.likes.length}</span>

            {
                me && image.user._id === me.userId &&
                (<button
                    style={{
                        float: 'right',
                        marginLeft: 10
                    }}
                    onClick={deleteHandler}
                >
                    삭제
                </button>)
            }

            <button
                style={{ float: 'right' }}
                onClick={onSubmit}
            >
                {hasLiked ? "좋아요 취소" : "좋아요"}
            </button>
        </div>
    )
}

export default ImagePage;
import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
    const [images, setImages] = useState([]);
    const [myImages, setMyImages] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [imageUrl, setImageUrl] = useState("/images");
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [me] = useContext(AuthContext);

    useEffect(() => {
        setImageLoading(true);
        axios.get(imageUrl)
            // .then(result => setImages(prevData => [...prevData, ...result.data]))
            .then(result => setImages([...images, ...result.data]))
            .catch(err => {
                console.error(err);
                setImageError(err);
            })
            .finally(() => setImageLoading(false));
        //eslint-disable-next-line
    }, [imageUrl]);

    useEffect(() => {
        if (me) {
            setTimeout(() => {
                axios.get("/users/me/images")
                    .then(result => setMyImages(result.data))
                    .catch(err => console.error(err));
            }, 0);
        } else {
            setMyImages([]);
            setIsPublic(true);
        }
    }, [me])

    const loadMoreImages = () => {
        if (images.length === 0 || imageLoading) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(`/images?lastid=${lastImageId}`);
    }

    return (
        <ImageContext.Provider value={{
            images,
            setImages,
            myImages,
            setMyImages,
            isPublic,
            setIsPublic,
            loadMoreImages,
            imageLoading,
            imageError
        }}>
            {prop.children}
        </ImageContext.Provider>
    )
}
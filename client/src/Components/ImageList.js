import React, { useContext } from 'react';
import { ImageContext } from '../context/ImageContext'

const ImageList = () => {
    const [images] = useContext(ImageContext)

    const imgList = images.map(image => (
        <img
            key={image.key}
            src={`http://localhost:3000/uploads/${image.key}`}
            alt={image.key}
            style={{ width: '100%' }}
        />
    ));

    return (
        <div>
            <h3>Image List</h3>
            {imgList}
        </div>
    )
}

export default ImageList;
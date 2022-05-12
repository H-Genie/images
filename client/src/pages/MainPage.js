import React from 'react';
import UploadForm from '../Components/UploadForm';
import ImageList from '../Components/ImageList';

const MainPage = () => {
    return (
        <>
            <h2>사진첩</h2>
            <UploadForm />
            <ImageList />
        </>
    )
}

export default MainPage;
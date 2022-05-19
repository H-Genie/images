import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProgressBar from './ProgressBar';
import "./UploadForm.css";
import { ImageContext } from '../context/ImageContext';

const UploadForm = () => {
    const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
    const defaultFilenName = "이미지 파일을 업로드 해주세요.";
    const [imgSrc, setImgSrc] = useState(null);
    const [files, setFiles] = useState(null);
    const [fileName, setFileName] = useState(defaultFilenName);
    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let file of files) formData.append("image", file);
        formData.append("public", isPublic);

        try {
            const res = await axios.post("/images", formData, {
                headers: { "Content-Type": "multipart/form-data*" },
                onUploadProgress: e => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                }
            });

            if (isPublic) setImages([...images, ...res.data]);
            else setMyImages([...myImages, ...res.data]);
            toast.success("이미지 업로드 성공");

            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFilenName);
                setImgSrc(null);
            }, 3000);
        } catch (err) {
            toast.error(err);
            setPercent(0);
            setFileName(defaultFilenName);
            setImgSrc(null);
            console.error(err);
        }
    }

    const imageSelectHandler = e => {
        const imageFiles = e.target.files;
        setFiles(imageFiles);
        const imageFile = imageFiles[0];
        setFileName(imageFile.name);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile);
        fileReader.onload = e => setImgSrc(e.target.result);
    }

    return (
        <form onSubmit={onSubmit}>
            <img
                src={imgSrc}
                alt=""
                className={`image-preview ${imgSrc && "image-preview-show"}`}
            />
            <ProgressBar percent={percent} />
            <div className='file-dropper'>
                {fileName}
                <input
                    id='iamge'
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={imageSelectHandler}
                />
            </div>
            <input
                type='checkbox'
                id='public-check'
                value={!isPublic}
                onChange={() => setIsPublic(!isPublic)}
            />
            {isPublic}
            <label htmlFor='public-check'> 비공개</label>
            <button
                type='submit'
                style={{
                    width: '100%',
                    borderRadius: 3,
                    height: 40,
                    cursor: 'pointer'
                }}
            >
                제출
            </button>
        </form>
    );
}

export default UploadForm;
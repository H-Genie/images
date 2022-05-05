import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProgressBar from './ProgressBar';
import "./UploadForm.css";

const UploadForm = () => {
    const defaultFilenName = "이미지 파일을 업로드 해주세요.";
    const [imgSrc, setImgSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(defaultFilenName);
    const [percent, setPercent] = useState(0);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);

        try {
            await axios.post("/images", formData, {
                headers: { "Content-Type": "multipart/form-data*" },
                onUploadProgress: e => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                }
            });
            toast.success("이미지 업로드 성공");
            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFilenName);
                setImgSrc(null);
            }, 3000);
        } catch (err) {
            toast.error(err.message);
            setPercent(0);
            setFileName(defaultFilenName);
            setImgSrc(null);
            console.error(err);
        }
    }

    const imageSelectHandler = e => {
        const imageFile = e.target.files[0];
        setFile(imageFile);
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
                    accept='image/*'
                    onChange={imageSelectHandler}
                />
            </div>
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
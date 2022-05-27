import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProgressBar from './ProgressBar';
import "./UploadForm.css";
// import { ImageContext } from '../context/ImageContext';

const UploadForm = () => {
    // const { setImages, setMyImages } = useContext(ImageContext);

    const [files, setFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);
    const inputRef = useRef();

    // const onSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     for (let file of files) formData.append("image", file);
    //     formData.append("public", isPublic);

    //     try {
    //         const res = await axios.post("/images", formData, {
    //             headers: { "Content-Type": "multipart/form-data*" },
    //             onUploadProgress: e => {
    //                 setPercent(Math.round((100 * e.loaded) / e.total));
    //             }
    //         });

    //         if (isPublic) setImages(prevData => [...res.data, ...prevData]);
    //         // setMyImages(prevData => [...res.data, ...prevData]);
    //         else setMyImages(prevData => [...res.data, ...prevData]);

    //         toast.success("이미지 업로드 성공");

    //         setTimeout(() => {
    //             setPercent(0);
    //             setPreviews([]);
    //             inputRef.current.value = null;
    //         }, 3000);
    //     } catch (err) {
    //         toast.error(err);
    //         setPercent(0);
    //         setPreviews([]);
    //         console.error(err);
    //     }
    // }

    const onSubmitV2 = async (e) => {
        e.preventDefault();
        try {
            const presignedData = await axios.post("/images/presigned", {
                contentTypes: [...files].map(file => file.type)
            });

            const result = await Promise.all([...files].map((file, index) => {
                const { presigned } = presignedData.data[index];
                const formData = new FormData();
                for (const key in presigned.fields) {
                    formData.append(key, presigned.fields[key])
                }
                formData.append("Content-Type", file.type);
                formData.append("file", file);

                return axios.post(presigned.url, formData)
            }));

            toast.success("이미지 업로드 성공");
            setTimeout(() => {
                setPercent(0);
                setPreviews([]);
                inputRef.current.value = null;
            }, 3000);
        } catch (err) {
            toast.error(err);
            setPercent(0);
            setPreviews([]);
            console.error(err);
        }
    }

    const imageSelectHandler = async (e) => {
        const imageFiles = e.target.files;
        setFiles(imageFiles);

        const imagePreviews = await Promise.all(
            [...imageFiles].map(async (imageFile) => {
                return new Promise((resolve, reject) => {
                    try {
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(imageFile);
                        fileReader.onload = e => resolve({
                            imgSrc: e.target.result,
                            fileName: imageFile.name
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            })
        );

        setPreviews(imagePreviews);
    }

    const previewImages = previews.map(preview => (
        <img
            src={preview.imgSrc}
            alt={preview.imgSrc}
            key={preview.imgSrc}
            className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
            style={{
                width: 180,
                height: 180,
                objectFit: 'cover',
                margin: 0
            }}
        />
    ));

    const fileName = previews.length === 0 ?
        '이미지 파일을 업로드 해주세요.' :
        previews.reduce((prev, current) => prev + `${current.fileName} `, '');

    return (
        <form onSubmit={onSubmitV2}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    margin: '20px 0'
                }}
            >
                {previewImages}
            </div>
            <ProgressBar percent={percent} />
            <div className='file-dropper'>
                {fileName}
                <input
                    ref={ref => inputRef.current = ref}
                    id='iamge'
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={imageSelectHandler}
                />
            </div>
            {
                previews.length > 0 &&
                <div>
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
                </div>
            }
        </form>
    );
}

export default UploadForm;
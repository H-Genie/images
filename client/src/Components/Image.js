import React, { useState, useEffect } from 'react';

const Image = ({ imageUrl }) => {
    const [hashedUrl, setHashedUrl] = useState(imageUrl);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isError && !intervalId) intervalId = setInterval(() => setHashedUrl(`${imageUrl}#${Date.now()}`), 1000);
        else if (!isError && intervalId) clearInterval(intervalId);
        else setHashedUrl(imageUrl);

        return () => clearInterval(intervalId);
    }, [isError, setHashedUrl, imageUrl]);

    return (
        <img
            alt=""
            src={hashedUrl}
            onError={() => setIsError(true)}
            onLoad={() => setIsError(false)}
            style={{ visibility: isError ? "hidden" : "visible" }}
        />
    )
}

export default Image;
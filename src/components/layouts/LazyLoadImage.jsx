import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const LazyLoadImage = ({ src, fallback, className, ...props }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image;
        loadImg.onload = () => resolve(image);
        loadImg.onerror = (err) => {
          if (fallback) {
            setImgSrc(fallback);
            setImgLoaded(true);
          }
          reject(err);
        };
      });
    };

    loadImage(src)
      .then(() => setImgLoaded(true))
      .catch((err) => {});
  }, []);

  return (
    <>
      {!imgLoaded ? (
        <Skeleton height="100%" containerClassName={className} {...props} />
      ) : (
        <img src={imgSrc} className={className} {...props} />
      )}
    </>
  );
};

export default LazyLoadImage;

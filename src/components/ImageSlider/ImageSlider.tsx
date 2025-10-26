import {useState} from 'react'

const ImageSlider = ({ images }: { images: string[] }) => {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const [currentIndex, setCurrentIndex] = useState(0);

    const sliderStyles: React.CSSProperties = {
        height: "100%",
        position: "relative",
    };

    const slideStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundImage: `url(${baseUrl+images[currentIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 999,
    };

    const leftArrowStyles: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#fff',
        fontSize: '45px',
    };

    const rightArrowStyles: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#fff',
        fontSize: '45px',
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

  return (
    <div style={sliderStyles} >
        {images.length > 1 && (
          <>
            <div style={leftArrowStyles} onClick={handlePrev}>↼</div>
            <div style={rightArrowStyles} onClick={handleNext}>⇀</div>
          </>
        )}
      <div style={slideStyles}></div>
    </div>
  )
}

export default ImageSlider

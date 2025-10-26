type ImageSliderProps = {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const ImageSlider = ({ images, currentIndex, setCurrentIndex}: ImageSliderProps) => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const sliderStyles: React.CSSProperties = {
    height: "100%",
    position: "relative",
  };

  const slideStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${baseUrl + images[currentIndex]})`,
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

const handlePrev = () => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const handleNext = () => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);

  return (
    <div style={sliderStyles} >
      {images.length > 1 && (
        <>
          <div style={leftArrowStyles} onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}>
            ↼
          </div>
          <div style={rightArrowStyles} onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}>
            ⇀
          </div>
        </>
      )}
      <div style={slideStyles}></div>
    </div>
  )
}

export default ImageSlider

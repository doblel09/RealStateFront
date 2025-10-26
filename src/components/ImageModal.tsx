import ImageSlider from "./ImageSlider/ImageSlider";

type ImageModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  images: string[];
}

const ImageModal = ({ isModalOpen, setIsModalOpen, images }: ImageModalProps) => {

  const handleBackdropClick = () => setIsModalOpen(false);
  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg max-w-4xl w-full p-4 h-[500px]">
            <ImageSlider images={images} />
          </div>
        </div>
      )}
    </>
  )
}

export default ImageModal
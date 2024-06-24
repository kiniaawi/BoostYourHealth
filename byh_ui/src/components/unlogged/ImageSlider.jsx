import React, { useCallback, useEffect, useState } from "react";

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderStyles = {
    height: "100%",
    width: "100%",
    position: "relative",
  };

  const slideStyles = {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: `
    linear-gradient(
      to left,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.2) 35%,
      rgba(0, 0, 0, 0) 100%
    ),
    url(${slides[currentIndex].url})`,
    filter: "blur(0.1px)",
    transition: "background-image 0.5s ease-in-out",
    boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.1)",
  };

  const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  useEffect(() => {
    const intervalId = setInterval(goToNext, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex, goToNext]);

  return (
    <div style={sliderStyles}>
      <div style={leftArrowStyles} onClick={goToPrevious}>
        {"<"}
      </div>
      <div style={rightArrowStyles} onClick={goToNext}>
        {">"}
      </div>
      <div style={slideStyles}></div>
    </div>
  );
};

export default ImageSlider;

import { Box } from "@mui/material";
import React from "react";
import ImageSlider from "./ImageSlider";

const Rightbar = () => {
  const slides = [
    { url: "/slides/image1.jpg", title: "img1" },
    { url: "/slides/image2.jpg", title: "img2" },
    { url: "/slides/image3.jpg", title: "img3" },
    { url: "/slides/image4.jpg", title: "img4" },
    { url: "/slides/image5.jpg", title: "img5" },
  ];

  const containerStyles = {
    width: "63vw",
    height: "83vh",
    margin: "0 auto",
  };

  return (
    <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <Box style={containerStyles}>
          <ImageSlider slides={slides} />
        </Box>
      </Box>
    </Box>
  );
};

export default Rightbar;

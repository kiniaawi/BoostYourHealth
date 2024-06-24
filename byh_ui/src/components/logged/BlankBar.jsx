import { Box } from "@mui/material";
import React from "react";

const BlankBar = () => {
  return (
    <Box
      flex={1}
      p={2}
      style={{
        marginBottom: "0",
        paddingBottom: "100vh",
      }}
      sx={{
        display: { xs: "none", sm: "block" },
        backgroundColor: "#f2efe6",
      }}
    >
      <Box position="fixed"></Box>
    </Box>
  );
};

export default BlankBar;

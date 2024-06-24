import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";

const Loading = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "loading", { path: "/" });

  return (
    <Box flex={12} p={2}>
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 5 }}>
        Ładowanie...
      </Typography>
    </Box>
  );
};

export default Loading;

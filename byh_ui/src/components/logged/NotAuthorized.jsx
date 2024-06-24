import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";

const NotAuthorized = ({ onChangeContent }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "emailCookie",
    "currentPageCookie",
  ]);
  setCookie("currentPageCookie", "not-authorized", { path: "/" });

  return (
    <Box flex={12} p={2}>
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 5 }}>
        Nie jesteś upoważniony do korzystania z tej podstrony
      </Typography>
    </Box>
  );
};

export default NotAuthorized;

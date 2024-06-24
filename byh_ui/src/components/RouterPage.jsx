import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Switch,
} from "react-router-dom";
import Register from "../pages/unlogged/Register";
import Login from "../pages/unlogged/Login";

const RouterPage = ({
  lang,
  currentContent,
  currentLang,
  setCurrentContent,
  handleLangChange,
  onChangeContent,
  handleChangeContent,
}) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          component={
            <Login
              currentContent="loginPg"
              onChangeContent={handleChangeContent}
              lang={currentLang}
              setCurrentContent={setCurrentContent}
            />
          }
        />
        <Route
          path="/login"
          component={
            <Login
              currentContent="loginPg"
              onChangeContent={handleChangeContent}
              lang={currentLang}
              setCurrentContent={setCurrentContent}
            />
          }
        />
        <Route
          path="/register"
          component={
            <Register
              currentContent="registerPg"
              onChangeContent={handleChangeContent}
              lang={currentLang}
              setCurrentContent={setCurrentContent}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default RouterPage;

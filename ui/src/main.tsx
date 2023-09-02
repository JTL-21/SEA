import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { UserProvider } from "./hooks/useUser";
import CreateProject from "./pages/CreateProject";
import ProjectPage from "./pages/Project";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Layout>
          <Routes>
            <Route index Component={App} />
            <Route path="/sign-up" Component={SignUp} />
            <Route path="/sign-in" Component={SignIn} />
            <Route path="/create-project" Component={CreateProject} />
            <Route path="/project/:key/:slug?" Component={ProjectPage} />
          </Routes>
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

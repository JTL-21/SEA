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
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<App />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/project/:key/:slug?" element={<ProjectPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

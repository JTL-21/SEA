import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./components/Layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { UserProvider } from "./hooks/useUser";
import ProjectPage from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchProjects from "./pages/SearchProjects";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Layout>
          <Routes>
            <Route element={<ProtectedRoute inverse={true} />}>
              <Route path="/sign-up" Component={SignUp} />
              <Route path="/sign-in" Component={SignIn} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/projects" />} />
              <Route path="/project/:key/add-ticket" Component={ProjectPage} />
              <Route path="/project/:key/edit" Component={ProjectPage} />
              <Route path="/project/:key/:slug?" Component={ProjectPage} />
              <Route path="/projects" Component={SearchProjects} />
              <Route path="/projects/create" Component={SearchProjects} />
            </Route>
          </Routes>
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./hooks/useUser";
import "./index.css";
import ProjectPage from "./pages/Project";
import SearchProjects from "./pages/SearchProjects";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Assigned from "./pages/Assigned";

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
              <Route path="/assigned/:slug?" Component={Assigned} />
            </Route>
          </Routes>
        </Layout>
        <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          position="bottom-right"
        />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

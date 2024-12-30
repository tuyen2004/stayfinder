import React from "react";
import { Navigate } from "react-router-dom";
import AccessDenied from "./AccessDenied";

const ProtectedRoute = ({ children, role }) => {
  console.log("role admin:", role);
  if (role !== 0 && role !== 1) {
    return <AccessDenied />;
  }
  return children;
};

export default ProtectedRoute;

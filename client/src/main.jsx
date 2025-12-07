import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About/About.jsx";
import Menu from "./pages/Menu/Menu.jsx";
import Booking from "./pages/Booking/Booking.jsx";
import Feed from "./pages/Feed/Feed.jsx";
import Account from "./pages/Account/Account.jsx";
import ForgotPassword from "./pages/Account/ForgotPassword.jsx";
import ResetPassword from "./pages/Account/ResetPassword.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminPanel from "./pages/Admin/AdminPanel.jsx";
import AdminChat from "./pages/Admin/AdminChat.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminReservations from './pages/Admin/AdminReservations.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "menu", element: <Menu /> },
      { path: "booking", element: <Booking /> },
      { path: "feed", element: <Feed /> },
      { path: "account", element: <Account /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminPanel /> },
          { path: "chat", element: <AdminChat /> },
          { path: "products", element: <AdminProducts /> },
          { path: "reservations", element: <AdminReservations /> },
          { path: "users", element: <AdminUsers /> }
        ]
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

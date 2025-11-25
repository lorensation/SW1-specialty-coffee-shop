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
import Cart from "./pages/Cart/Cart.jsx";

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
      { 
        path: "cart", 
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ) 
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

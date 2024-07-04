import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {RouterProvider, createBrowserRouter} from 'react-router-dom'

import {Home} from "./components/Home/home.jsx";
import { ProductList } from "./components/Consoles/ProductList.jsx";
import { ProductDetails } from "./components/Consoles/ProductDetail.jsx";

const router = createBrowserRouter([
  {
    element: <App/>,  
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "product",
        element: <ProductList/>
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Home } from "./components/Home/home.jsx";
import { ProductList } from "./components/Consoles/ProductList.jsx";
import { ProductDetails } from "./components/Consoles/ProductDetail.jsx";
import { InvoiceList } from "./components/Consoles/InvoiceList.jsx";
import InvoiceDetail from "./components/Consoles/InvoiceDetail.jsx";
import { ServiceList } from "./components/Consoles/Services.jsx";
import { Maintenance } from "./components/Consoles/Maintenance.jsx";
import { ProductMaintenance } from "./components/Consoles/ProductMaintenance.jsx";
import { ReservationList } from "./components/Consoles/ReservationList.jsx";
import { ReservationDetail } from "./components/Consoles/ReservationDetail.jsx";
import { Management } from "./components/Consoles/Management.jsx";
import ReservationForm from "./components/Consoles/ReservationForm.jsx";
import InvoiceForm from "./components/Consoles/InvoiceForm.jsx";
import { ScheduleMaintenance } from "./components/Consoles/ScheduleMaintenance.jsx";
import AdminDashboard from "./components/Consoles/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: <AdminDashboard/>,
      },
      {
        path: "product",
        element: <ProductList />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "billing",
        element: <InvoiceList />,
      },
      {
        path: "billing/:id",
        element: <InvoiceDetail />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "maintenance/service",
        element: <ServiceList />,
      },
      {
        path: "maintenance/product",
        element: <ProductMaintenance />,
      },
      {
        path: "maintenance/schedule",
        element: <ScheduleMaintenance/>
      },
      {
        path: "reservation",
        element: <ReservationList />,
      },
      {
        path: "reservation/:id",
        element: <ReservationDetail />,
      },
      {
        path: "management",
        element: <Management/>
      },
      {
        path: "management/reservation",
        element: <ReservationForm/>
      },
      {
        path: "management/invoice",
        element: <InvoiceForm/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

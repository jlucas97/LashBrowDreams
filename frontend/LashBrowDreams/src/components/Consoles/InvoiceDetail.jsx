import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import InvoiceService from "../../services/InvoiceService";

const InvoiceDetail = () => {
  const routeParams = useParams();
  const theme = useTheme();
  const [dataHeading, setData] = useState([]);
  const [dataDetails, setDataD] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    InvoiceService.getInvoiceData(routeParams.id)
      .then((response) => {
        console.log("API response:", response.results.details);
        setData(response.results.heading[0]);
        setDataD(response.results.details);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message || "Sucedió un error");
        setLoaded(true);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box p={3} bgcolor={theme.palette.background.paper} borderRadius={1}>
      {/* Sector Encabezado */}
      <Box mb={3}>
        <Typography variant="h6">#Factura: {dataHeading.ID_Factura}</Typography>
        <Typography variant="h6">Fecha: {dataHeading.Fecha}</Typography>
        <Typography variant="h6">Cliente: {dataHeading.Nombre}</Typography>
        <Typography variant="h6">
          Email: {dataHeading.Correo_Electronico}
        </Typography>
        <Typography variant="h6">Sucursal: {dataHeading.Tienda}</Typography>
        <Typography variant="h6">Dirección: {dataHeading.Direccion}</Typography>
      </Box>

      {/* Sector Detalle */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDetails.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ID}</TableCell>
                <TableCell>{item.Producto}</TableCell>
                <TableCell>{item.Servicio}</TableCell>
                <TableCell>{item.Cantidad}</TableCell>
                <TableCell>{item.Subtotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sector Totales */}
      <Box mt={3}>
        <Typography variant="h6">SubTotal: ₡{dataHeading.Subtotal}</Typography>
        <Typography variant="h6">I.V.A: ₡{dataHeading.IVA}</Typography>
        <Typography variant="h6">Total: ₡{dataHeading.total}</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceDetail;

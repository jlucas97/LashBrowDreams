import React from "react";
import { TextField, MenuItem, Grid } from "@mui/material";
import { toast } from "react-toastify";
import InvoiceService from "../../services/InvoiceService";

const ProformaSelector = ({ proformas, onProformaSelect }) => {
  const handleProformaChange = (event) => {
    const proformaId = event.target.value;
    InvoiceService.getInvoiceData(proformaId)
      .then((proformaData) => {
        onProformaSelect(proformaData);
      })
      .catch(() => {
        toast.error("Error al cargar la proforma seleccionada");
      });
  };

  if (!proformas || proformas.length === 0) {
    return null; // No renderizar nada si no hay proformas
  }

  return (
    <Grid item xs={6} style={{ marginTop: "16px" }}>
      <TextField
        select
        label="Seleccionar Proforma"
        fullWidth
        onChange={handleProformaChange}
      >
        {proformas.map((proforma) => (
          <MenuItem key={proforma.id} value={proforma.id}>
            {proforma.id} - {proforma.date}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

export default ProformaSelector;

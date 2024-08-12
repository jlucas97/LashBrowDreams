import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import InvoiceService from "../../services/InvoiceService";
import debounce from "lodash/debounce";
import { appTheme } from "../../themes/theme";
import ReportePastel from "./GraphicPie";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(2),
  flex: 1,
}));

const columns = [
  { field: "ID_Factura", headerName: "ID Factura", width: 130 },
  { field: "Fecha", headerName: "Fecha", width: 130 },
  { field: "Nombre", headerName: "Nombre", width: 130 },
  { field: "Total", headerName: "Total", width: 130 },
  {field: "Tipo", headerName: "Tipo de Factura",width: 130 }
];

export function InvoiceList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [showReporte, setShowReporte] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const storeId = localStorage.getItem("selectedStoreId");

  const fetchInvoices = useCallback((storeId, query = "", date = null) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setLoaded(false); // Ensure loading state is managed
    InvoiceService.getInvoiceListByStore(storeId, query, formattedDate)
      .then((response) => {
        if (response && response.results) {
          setData(response.results);
          setError(""); // Limpiar error previo
        } else {
          setData([]);
          if (query || formattedDate) {
            toast.warn("No se encontraron coincidencias");
          }
        }
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setData([]); // Mostrar grid vacío
        if (error.response && error.response.status === 400) {
          toast.warn("No se encontraron coincidencias");
        } else {
          toast.error("Error al obtener las facturas");
        }
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchInvoices(storeId, search, selectedDate);
    } else {
      setError("Store ID not found in localStorage");
      setLoaded(true);
    }
  }, [storeId, search, selectedDate, fetchInvoices]);

  const handleSearchChange = useCallback((event) => {
    const query = event.target.value;
    setSearch(query);
    if (query === "") {
      fetchInvoices(storeId, "", selectedDate);
    } else {
      debouncedSearch(query);
    }
  }, [selectedDate, fetchInvoices]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    fetchInvoices(storeId, search, date); // Llamar con la fecha seleccionada
  }, [storeId, search, fetchInvoices]);

  const handleReset = useCallback(() => {
    setSearch("");
    setSelectedDate(null);
    fetchInvoices(storeId);
  }, [storeId, fetchInvoices]);

  const debouncedSearch = useCallback(debounce((query) => fetchInvoices(storeId, query, selectedDate), 300), [storeId, fetchInvoices, selectedDate]);

  const handleShowReporte = () => {
    setShowReporte(!showReporte);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography variant="h2" align="center" gutterBottom marginBottom={8}>
        Facturas
      </Typography>
      <SearchContainer>
        <SearchInput
          label="Buscar por nombre del cliente"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
        >
          Limpiar
        </Button>
      </SearchContainer>
      <Grid container justifyContent="center" style={{ marginBottom: "20px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month', 'day']}
            label="Seleccionar Fecha"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </LocalizationProvider>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ID_Factura}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={(params) => {
            setSelectionModel([params.id]);
            navigate(`/billing/${params.id}`);
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": {
              backgroundColor: appTheme.palette.background.main,
              borderColor: appTheme.palette.primary.dark,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${appTheme.palette.primary.main}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: appTheme.palette.primary.main,
              color: appTheme.palette.primary.contrastText,
              fontSize: 16,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: appTheme.palette.primary.dark,
              color: appTheme.palette.primary.contrastText,
            },
            "& .Mui-selected": {
              backgroundColor: appTheme.palette.primary.main,
              color: appTheme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: appTheme.palette.primary.dark,
              },
            },
          }}
        />
      </div>
      <Button variant="contained" onClick={handleShowReporte} style={{ margin: "20px" }}>
        {showReporte ? "Ocultar Reporte" : "Mostrar Reporte por precios"}
      </Button>

      {showReporte && <ReportePastel />}
    </>
  );
}

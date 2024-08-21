import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InvoiceService from "../../services/InvoiceService";
import debounce from "lodash/debounce";
import { appTheme } from "../../themes/theme";
import ReportePastel from "./GraphicPie";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import StoreServices from "../../services/StoreServices";

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  { field: "Tipo", headerName: "Tipo de Factura", width: 130 },
];

export function InvoiceList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [showReporte, setShowReporte] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [stores, setStores] = useState([]); // Inicializar como array vacío
  const storeId = localStorage.getItem("selectedStoreId");
  const [selectedStore, setSelectedStore] = useState(storeId); // Estado para la sucursal seleccionada
  const navigate = useNavigate();
  const userRole = parseInt(localStorage.getItem("userRole"));
  const userEmail = localStorage.getItem("userEmail");

  const fetchStores = useCallback(() => {
    StoreServices.getStores()
      .then((response) => {
        console.log("Respuesta de getStores:", response); // Verificar la respuesta
        setStores(response.data.results);
      })
      .catch((error) => {
        console.error("Error al obtener sucursales:", error); // Verificar si hay un error
        setStores([]); // Establecer un array vacío en caso de error
        toast.error("Error al cargar las sucursales");
      });
  }, []);

  const fetchInvoices = useCallback(
    (storeId, query = "", date = null) => {
      const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;

      setLoaded(false);

      let fetchPromise;

      if (userRole === 3) {
        fetchPromise = InvoiceService.getInvoiceListByUser(userEmail, query);
      } else {
        fetchPromise = InvoiceService.getInvoiceListByStore(storeId, query);
      }

      fetchPromise
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
    },
    [userRole, userEmail]
  );

  useEffect(() => {
    if (storeId) {
      fetchInvoices(selectedStore, search, selectedDate);
    } else {
      setError("Store ID not found in localStorage");
      setLoaded(true);
    }
  }, [storeId, search, selectedDate, selectedStore, fetchInvoices]);

  useEffect(() => {
    if (userRole === 1) {
      fetchStores(); // Cargar sucursales solo si el userRole es 1
    }
  }, [userRole, fetchStores]);

  const handleStoreChange = useCallback(
    (event) => {
      const selectedStoreId = event.target.value;
      setSelectedStore(selectedStoreId);
      localStorage.setItem("selectedStoreId", selectedStoreId); // Actualizar el localStorage
      fetchInvoices(selectedStoreId, search, selectedDate);
    },
    [search, selectedDate, fetchInvoices]
  );

  const handleSearchChange = useCallback(
    (event) => {
      const query = event.target.value;
      setSearch(query);
      if (query === "") {
        fetchInvoices(selectedStore, "", selectedDate);
      } else {
        debouncedSearch(query);
      }
    },
    [selectedDate, fetchInvoices, selectedStore]
  );

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);
      fetchInvoices(selectedStore, search, date);
    },
    [selectedStore, search, fetchInvoices]
  );

  const handleReset = useCallback(() => {
    setSearch("");
    setSelectedDate(null);
    fetchInvoices(selectedStore);
  }, [selectedStore, fetchInvoices]);

  const debouncedSearch = useCallback(
    debounce((query) => fetchInvoices(selectedStore, query, selectedDate), 300),
    [selectedStore, fetchInvoices, selectedDate]
  );

  const handleShowReporte = () => {
    setShowReporte(!showReporte);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography variant="h2" align="center" gutterBottom marginBottom={8} paddingTop={20}>
        Facturas
      </Typography>

      {userRole === 1 && ( 
        <Grid
          container
          justifyContent="center"
          style={{ marginBottom: "20px" }}
        >
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel>Sucursal</InputLabel>
            <Select
              value={selectedStore}
              onChange={handleStoreChange}
              label="Sucursal"
            >
              {Array.isArray(stores) && stores.length > 0 ? (
                stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay sucursales disponibles</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
      )}

      {userRole !== 3 && ( // Ocultar barra de búsqueda si el userRole es 3
        <SearchContainer>
          <SearchInput
            label="Buscar por nombre del cliente"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleReset}>
            Limpiar
          </Button>
        </SearchContainer>
      )}

      <Grid container justifyContent="center" style={{ marginBottom: "20px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month", "day"]}
            label="Seleccionar Fecha"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
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

      {userRole !== 3 && ( // Ocultar botón de reporte para el role 3
        <Button
          variant="contained"
          onClick={handleShowReporte}
          style={{ margin: "20px" }}
        >
          {showReporte ? "Ocultar Reporte" : "Mostrar Reporte por precios"}
        </Button>
      )}

      {showReporte && <ReportePastel />}
    </>
  );
}

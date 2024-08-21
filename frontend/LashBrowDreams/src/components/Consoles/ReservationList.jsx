import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { styled } from '@mui/material/styles';
import ReservationServices from "../../services/ReservationServices";
import StatusCircle from "../../context/StatusCircle";
import debounce from "lodash/debounce";
import Button from "@mui/material/Button";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { appTheme } from "../../themes/theme";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import StoreServices from "../../services/StoreServices"; // Importa el servicio de sucursales

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
  { field: "id", headerName: "ID", width: 50 },
  { field: "date", headerName: "Fecha", width: 130 },
  { field: "time", headerName: "Hora", width: 130 },
  { field: "customerId", headerName: "Cliente", width: 130 },
  { field: "serviceId", headerName: "Servicio", width: 200 },
  { field: "storeId", headerName: "Sucursal", width: 160 },
  {
    field: "status",
    headerName: "Estado de la cita",
    width: 160,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', marginRight: '1000%' }}>
        <StatusCircle status={params.value} />
      </div>
    ),
  },
  { field: "admin", headerName: "Encargado", width: 180 }
];

export function ReservationList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [stores, setStores] = useState([]); // Estado para almacenar las sucursales
  const storeId = localStorage.getItem("selectedStoreId");
  const [selectedStore, setSelectedStore] = useState(storeId); // Estado para la sucursal seleccionada
  const navigate = useNavigate();
  const userRole = parseInt(localStorage.getItem("userRole"));

  const fetchStores = useCallback(() => {
    StoreServices.getStores()
      .then((response) => {
        setStores(response.data.results);
      })
      .catch((error) => {
        console.error("Error al obtener sucursales:", error);
        setStores([]); // Establecer un array vacío en caso de error
        toast.error("Error al cargar las sucursales");
      });
  }, []);

  const fetchReservations = useCallback((storeId, customerId = "", date = null) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setLoaded(false);
    ReservationServices.getReservationsByStoreAndUser(storeId, null, customerId, formattedDate)
      .then((response) => {
        if (response && response.results && response.results.length > 0) {
          setData(response.results);
        } else {
          setData([]);
          toast.warn("No se encontraron coincidencias");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setData([]);
        toast.error("Error al obtener las reservaciones");
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchReservations(selectedStore, search, selectedDate);
    } else {
      setLoaded(true);
    }
  }, [storeId, search, selectedDate, selectedStore, fetchReservations]);

  useEffect(() => {
    if (userRole === 1) {
      fetchStores(); // Cargar sucursales solo si el userRole es 1
    }
  }, [userRole, fetchStores]);

  const handleStoreChange = useCallback((event) => {
    const selectedStoreId = event.target.value;
    setSelectedStore(selectedStoreId);
    localStorage.setItem("selectedStoreId", selectedStoreId); // Actualizar el localStorage
    fetchReservations(selectedStoreId, search, selectedDate);
  }, [search, selectedDate, fetchReservations]);

  const handleSearchChange = useCallback((event) => {
    const query = event.target.value;
    setSearch(query);
    debouncedSearch(query, selectedDate);
  }, [selectedDate]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    fetchReservations(selectedStore, search, date);
  }, [selectedStore, search, fetchReservations]);

  const handleReset = useCallback(() => {
    setSearch("");
    setSelectedDate(null);
    fetchReservations(selectedStore);
  }, [selectedStore, fetchReservations]);

  const debouncedSearch = useCallback(debounce((query, date) => fetchReservations(selectedStore, query, date), 300), [selectedStore, fetchReservations]);

  return (
    <>
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

      <SearchContainer>
        <SearchInput
          label="Buscar por cliente"
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
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={(params) => {
            navigate(`/reservation/${params.id}`);
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
    </>
  );
}

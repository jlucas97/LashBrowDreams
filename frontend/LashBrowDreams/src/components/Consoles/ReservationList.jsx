import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { styled } from '@mui/material/styles'; // Cambiado a @mui/material/styles
import ReservationServices from "../../services/ReservationServices";
import UserService from "../../services/UserService";
import StatusCircle from "../../context/StatusCircle";
import debounce from "lodash.debounce";
import Button from "@mui/material/Button";
import { appTheme } from "../../themes/theme";

const SearchContainer = styled('div')(({ theme }) => ({ // Cambiado appTheme a theme
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SearchInput = styled(TextField)(({ theme }) => ({ // Cambiado appTheme a theme
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
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const storeId = localStorage.getItem("selectedStoreId");

  useEffect(() => {
    if (storeId) {
      fetchReservations(storeId);
    } else {
      setError("Store ID not found in localStorage");
      setLoaded(true);
    }
  }, [storeId]);

  const fetchReservations = (storeId, customerId = "") => {
    ReservationServices.getReservationsByStoreAndUser(storeId, null, customerId)
      .then((response) => {
        console.log("Fetch Reservations Response:", response); // Log the response
        if (response && response.results) {
          setData(response.results);
        } else {
          setError("No data found");
          setData([]);
        }
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message || "Sucedió un error");
        setLoaded(true);
      });
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    if (query === "") {
      fetchReservations(storeId);
    } else {
      debouncedSearch(query);
    }
  };

  const searchUsers = (query) => {
    if (storeId) {
      UserService.getUserOnSearchBar(query)
        .then((response) => {
          console.log("Search Users Response:", response); // Log the response
          if (response && response.results) {
            const users = response.results;
            if (users.length > 0) {
              const userEmails = users.map(user => user.email);
              fetchReservations(storeId, userEmails[0]); // For simplicity, using the first matched user email
            } else {
              setData([]);
              setError("No users found");
            }
          } else {
            setData([]);
            setError("No users found");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el usuario:", error);
          setError(error.message || "Sucedió un error");
          setData([]);
        });
    }
  };

  const debouncedSearch = debounce(searchUsers, 300);

  console.log("Data", data);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
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
          onClick={() => fetchReservations(storeId)}
        >
          Reset
        </Button>
      </SearchContainer>
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

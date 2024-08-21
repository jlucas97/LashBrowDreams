import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "../Consoles/AdminDashboard";

const routes = {
  Productos: "/product",
  Reservas: "/reservation",
  Facturación: "/billing",
  Facturas: "/billing",
  Catálogo: "/product",
  Mantenimiento: "/maintenance",
  Gestión: "/management",
};

function getPagesByRole(role) {
  const numericRole = Number(role);
  switch (numericRole) {
    case 1: // Administrador
    case 2: // Encargado
      return ["Productos", "Reservas", "Facturación"];
    case 3: // Cliente
      return ["Productos", "Reservas", "Facturas"];
    default:
      return ["Productos"];
  }
}

function getUserSettings(role) {
  const numericRole = Number(role);
  switch (numericRole) {
    case 1: // Administrador
    case 2: // Encargado
      return ["Catálogo", "Mantenimiento", "Gestión", "Cerrar Sesión"];
    case 3: // Cliente
      return ["Catálogo", "Cerrar Sesión"];
    default:
      return ["Iniciar Sesión"];
  }
}

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  let userRole = UserService.getRole();
  const isUserLoggedIn = UserService.isLoggedIn();
  const userEmail = UserService.getUserEmail();
  const userName = UserService.getUserName();

  const pages = getPagesByRole(userRole);
  const settings = getUserSettings(userRole);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLoginClick = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLBDClick = () => {
    userRole = Number(userRole);
    if (userRole === 1 || userRole === 2) {
      navigate("/admin"); // Redirige al admin dashboard
    } else {
      navigate("/"); // Redirige al landing page si no es admin
    }
  };

  const handleLogin = () => {
    const storeId = localStorage.getItem("selectedStoreId");

    UserService.login(emailInput, passwordInput, storeId)
      .then(() => {
        const userRole = Number(UserService.getRole()); 

        setOpenModal(false);
        toast.success("Inicio de sesión exitoso", {
          position: "top-right",
        });

        // Redirigir según el rol del usuario
        if (userRole === 1 || userRole === 2) {
          window.location.href = "/admin-dashboard"; // Redirigir al dashboard del administrador
        } else {
          window.location.href = "/"; // Redirigir al landing page para otros roles
        }
      })
      .catch((error) => {
        // Manejo de errores
        if (error.response && error.response.status === 403) {
          toast.error("El usuario no pertenece a esta sucursal", {
            position: "top-right",
          });
        } else if (error.response && error.response.status === 401) {
          toast.error("Credenciales inválidas", {
            position: "top-right",
          });
        } else {
          toast.error("Error inesperado durante el inicio de sesión", {
            position: "top-right",
          });
        }
        setOpenModal(false);
      });
  };

  const handleLogout = () => {
    UserService.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src="src/assets/logo.jpg"
              alt="Logo"
              style={{
                display: { xs: "none", md: "flex" },
                marginRight: "16px",
                height: "80px",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              onClick={handleLBDClick}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffeb3b",
                },
              }}
            >
              LBD
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={routes[page]}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <MenuIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LBD
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#ffeb3b",
                    },
                  }}
                  component={Link}
                  to={routes[page]}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {isUserLoggedIn ? (
                <>
                  <Tooltip
                    title={`Sesión iniciada como ${userName || userEmail}`}
                  >
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={userName || userEmail}
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={
                          setting === "Cerrar Sesión"
                            ? handleLogout
                            : handleCloseUserMenu
                        }
                        component={Link}
                        to={setting !== "Cerrar Sesión" ? routes[setting] : "#"}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLoginClick}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" textAlign="center" mb={2}>
            Iniciar Sesión
          </Typography>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default ResponsiveAppBar;

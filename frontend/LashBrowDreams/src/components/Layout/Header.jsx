import * as React from "react";
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
import AdbIcon from "@mui/icons-material/Adb";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { Link } from "@mui/material";

const pages = ["Productos"];
const restrictedPages = ["Reservas", "Facturación"];
const adminSettings = ["Perfil", "Mantenimiento", "Gestión", "Cerrar Sesión"];
const encargadoSettings = ["Perfil", "Cerrar Sesión"];
const userSettings = ["Iniciar Sesión"];
const routes = {
  Productos: "/product",
  Reservas: "/reservation",
  Facturación: "/billing",
};
const settingsRoutes = {
  Perfil: "/profile",
  Mantenimiento: "/maintenance",
  Gestión: "/management",
  "Iniciar Sesión": "/login",
};

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const userRole = localStorage.getItem("userRole") || "guest";
  const isUserLoggedIn = userRole !== "guest";

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLoginClick = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogin = () => {
    const data = {
      email: emailInput,
      password: passwordInput,
    };

    axios
      .post("http://localhost:81/lashbrowdreams/user/login", data)
      .then((response) => {
        if (response.data.status === 200) {
          localStorage.setItem("userToken", response.data.results.token);
          localStorage.setItem("userRole", response.data.results.user.role);
          handleCloseModal();
          window.location.reload(); // Para actualizar la interfaz según el rol
        } else {
          alert("Credenciales inválidas");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Ocurrió un error al iniciar sesión");
      });
  };

  const settings =
    userRole === "admin"
      ? adminSettings
      : userRole === "encargado"
      ? encargadoSettings
      : userSettings;

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
              component={Link}
              to="/"
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
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                {isUserLoggedIn &&
                  restrictedPages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
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
                  color="secondary"
                >
                  {page}
                </Button>
              ))}
              {isUserLoggedIn &&
                restrictedPages.map((page) => (
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
                    color="secondary"
                  >
                    {page}
                  </Button>
                ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {isUserLoggedIn ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="L" src="/static/images/avatar/2.jpg" />
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
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to={settingsRoutes[setting]}
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
    </>
  );
}
export default ResponsiveAppBar;

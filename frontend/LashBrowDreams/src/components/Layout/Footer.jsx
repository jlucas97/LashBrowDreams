import { Container, Grid, Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
export function Footer() {
  return (
    <Toolbar
      sx={{
        px: 2,
        position: "fixed",
        bottom: 0,
        left: 40,
        width: "100%",
        height: "4.5rem",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="primary.contrasttext" variant="subtitle1">
              ISW-613
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="secondary.main" variant="body1">
              {`${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}

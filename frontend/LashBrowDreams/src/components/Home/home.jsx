import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
  export function Home() {
    return (
      <Container sx={{ p: 2 }} maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          LashBrow Dreams
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Agenda aquí tu cita, consigue los productos de belleza y cuidado para cejas y pestañas aquí en LashBrow Dreams
        </Typography>
      </Container>
    );
  }
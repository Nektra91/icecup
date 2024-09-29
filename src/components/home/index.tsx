import { Box, Stack, Container, Card, CardContent, Typography } from "@mui/material";

function Home() {
  return (
    <Container>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
        <Box flexBasis={{ xs: '100%', sm: '100%' }} p={1}>
          <Card>
            <CardContent>
              <Typography variant="h5">Home page</Typography>
              <Typography>This is a work in progress</Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}

export default Home;
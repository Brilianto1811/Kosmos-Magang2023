import Grid from '@mui/material/Grid'
import TableKelolaReportos from 'src/components/kelola_reportos'

const KelolaReportos = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TableKelolaReportos />
      </Grid>
    </Grid>
  )
}

export default KelolaReportos

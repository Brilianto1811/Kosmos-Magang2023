import Grid from '@mui/material/Grid'
import TableLogPresensi from 'src/components/log_presensi'

const LogPresensi = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TableLogPresensi />
      </Grid>
    </Grid>
  )
}

export default LogPresensi

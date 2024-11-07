import Grid from '@mui/material/Grid'
import TableKelolaPegawai from 'src/components/kelola_pegawai'

const KelolaPegawai = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TableKelolaPegawai />
      </Grid>
    </Grid>
  )
}

export default KelolaPegawai

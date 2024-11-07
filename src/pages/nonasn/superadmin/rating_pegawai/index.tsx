import Grid from '@mui/material/Grid'
import TableRatingPegawai from 'src/components/rating_pegawai'

const RatingPegawai = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TableRatingPegawai />
      </Grid>
    </Grid>
  )
}

export default RatingPegawai

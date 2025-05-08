// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import
import React from 'react'
import Typography from '@mui/material/Typography'
import 'react-toastify/dist/ReactToastify.css'

const TableKelolaReportos = () => {

  return (
    <Card>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Superadmin</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                Kelola Laporan Kinerja
              </span>
            </>
          }
          style={{ backgroundColor: '#AFE1AF', textAlign: 'center' }}
        />
        <Typography sx={{ mb: 1.5, textAlign: 'center', color: 'black', fontSize: '20px', marginTop: '5px' }}>
          Dalam Tahap Progress
        </Typography>
      </div>
    </Card>
  )
}

export default TableKelolaReportos

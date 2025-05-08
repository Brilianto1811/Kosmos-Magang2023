// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
import { DataMdPegawai } from 'src/models/data-md-pegawai'
import { GetPegawai, InsertPegawai, UpdateSuperadminPegawai, DeletePegawai } from 'src/store/module-pegawai'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import cloneDeep from 'clone-deep'
import usedecodetoken from 'src/utils/decodecookies'
import { Icon } from '@iconify/react'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'

const TableKelolaPegawai = () => {

  const notifysuccess = (msg: any) => {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const notifyerror = (msg: any) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const form = {
    name_offpegawai: '',
    id_offpegawai: '',
    alias_offpegawai: '',
    nip_offpegawai: '',
    id_golongan: '',
    id_jabatan: '',
    id_bidang: '',
    id_bidangsub: '',
    id_instansi: '',
    str_pswd: '',
    plt_bidang: '',
    plt_bidangsub: '',
    cc_112: '',
  }
  const [mainInput, setMainInput] = useState(cloneDeep(form))
  const [dataPegawai, setDataPegawai] = useState<any>()
  const [dataPegawaiFilter, setDataPegawaiFilter] = useState<any>()
  const [open, setOpen] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [Delete, setDelete] = useState<string>('') as [string, React.Dispatch<React.SetStateAction<string>>]
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [selectedData, setSelectedData] = useState<any>(null)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [golonganOptions, setGolonganOptions] = useState<{ id_golongan: number; name_golongan: string; }[]>([]);
  const [jabatanOptions, setJabatanOptions] = useState<{ id_jabatan: number; name_jabatan: string; }[]>([]);
  const [bidangOptions, setBidangOptions] = useState<{ id_bidang: number; name_bidang: string; }[]>([]);
  const [bidangsubOptions, setBidangsubOptions] = useState<{ id_bidangsub: number; name_bidangsub: string; }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    console.log(value);
    filterData()
  };

  // Fungsi untuk memfilter data pegawai berdasarkan kata kunci pencarian
  const filterData = () => {
    if (!searchTerm) {
      setFilteredData(dataPegawai); // Jika tidak ada pencarian, tampilkan semua data
    } else {
      setFilteredData(
        dataPegawaiFilter.filter((pegawai: any) => {
          // Misalnya kita mencari berdasarkan nama pegawai
          return (
            pegawai.name_offpegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pegawai.alias_offpegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pegawai.name_bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pegawai.name_bidangsub.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
      setDataPegawai(filteredData);
    }
  };

  useEffect(() => {
    // Function to get data
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDataPegawai();
        const uniqueGolongan = Array.from(
          new Map(data?.map((item) => [item.id_golongan, {
            id_golongan: item.id_golongan,
            name_golongan: item.name_golongan
          }]) ?? []).values()
        );
        const uniqueJabatan = Array.from(
          new Map(data?.map((item) => [item.id_jabatan, {
            id_jabatan: item.id_jabatan,
            name_jabatan: item.name_jabatan
          }]) ?? []).values()
        );
        const uniqueBidang = Array.from(
          new Map(data?.map((item) => [item.id_bidang, {
            id_bidang: item.id_bidang,
            name_bidang: item.name_bidang
          }]) ?? []).values()
        );
        const uniqueBidangSub = Array.from(
          new Map(data?.map((item) => [item.id_bidangsub, {
            id_bidangsub: item.id_bidangsub,
            name_bidangsub: item.name_bidangsub
          }]) ?? []).values()
        );
        setGolonganOptions(uniqueGolongan);
        setJabatanOptions(uniqueJabatan);
        setBidangOptions(uniqueBidang);
        setBidangsubOptions(uniqueBidangSub);
        console.log(data, 'ini datanyaa');
      } finally {
        setTimeout(() => {
          setLoading(false);
          setDataLoaded(true);
        }, 700);
      }
    };

    fetchData(), filterData();
  }, []);

  const handleDeleteClick = (id_offpegawai: string) => {
    DeletePegawai(id_offpegawai)
      .then(response => {
        notifysuccess(response.pesan)
        getDataPegawai()
        handleCloseDelete()
      })
      .catch(error => {
        console.error('Error deleting data:', error)
      })
  }

  const columns: GridColDef[] = [
    {
      field: 'proses',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Proses',
      flex: 0.2,
      minWidth: 125,
      renderCell(params) {
        const row: DataMdPegawai = params.row

        return (
          <>
            <Button
              onClick={async () => {
                setOpenEdit(true);
                console.log('data edit', row);

                // Jika row adalah objek
                if (Array.isArray(row)) {
                  const editData = row.map((val: { id_offpegawai: any; str_pswd?: string }) => ({
                    ...val,
                    str_pswd: '', // Setel str_pswd menjadi string kosong
                  }));
                  setSelectedData(editData);
                } else {
                  const editData = { ...row, str_pswd: '' }; // Jika row adalah objek tunggal
                  setSelectedData(editData);
                }

                console.log('Updated selectedData:', selectedData);
              }}

            >
              <Icon icon='mingcute:pencil-line' color='#FFA500' width='25' height='25' />
            </Button>
            <Button onClick={() => handleClickOpenDelete(row.id_offpegawai)}>
              <Icon icon='solar:trash-bin-minimalistic-linear' color='#e3242b' width='25' height='25' hFlip={true} />
            </Button>
          </>
        )
      }
    },
    {
      field: 'name_offpegawai',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Pegawai',
      flex: 0.2,
      minWidth: 280
    },
    {
      field: 'alias_offpegawai',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Alias',
      flex: 0.2,
      minWidth: 190
    },
    {
      field: 'name_bidang',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Bidang',
      flex: 0.2,
      minWidth: 320
    },
    {
      field: 'name_bidangsub',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Sub Bidang',
      flex: 0.2,
      minWidth: 435
    },
    {
      field: 'name_golongan',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Golongan',
      flex: 0.2,
      minWidth: 200
    },
    {
      field: 'name_jabatan',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Nama Jabatan',
      flex: 0.2,
      minWidth: 200
    },
    {
      field: 'nip_offpegawai',
      align: 'left',
      headerAlign: 'center',
      headerName: 'NIP',
      flex: 0.2,
      minWidth: 195
    }
  ]

  function getCurrentYearAsString() {
    return new Date().getFullYear().toString();
  }


  const handleUpload = async () => {
    const decodedtoken = usedecodetoken();
    const currentYear = await getCurrentYearAsString();

    const bodyFormData = new FormData();
    bodyFormData.append('id_offpegawai', decodedtoken?.id_offpegawai || '');
    bodyFormData.append('name_offpegawai', mainInput.name_offpegawai);
    bodyFormData.append('alias_offpegawai', mainInput.alias_offpegawai);
    bodyFormData.append('nip_offpegawai', mainInput.nip_offpegawai);
    bodyFormData.append('id_golongan', mainInput.id_golongan);
    bodyFormData.append('id_jabatan', mainInput.id_jabatan);
    bodyFormData.append('id_bidang', mainInput.id_bidang);
    bodyFormData.append('id_bidangsub', mainInput.id_bidangsub);
    bodyFormData.append('id_instansi', '1');
    bodyFormData.append('str_pswd', 'newkosmos' + currentYear);
    bodyFormData.append('plt_bidang', '0');
    bodyFormData.append('plt_bidangsub', '0');
    bodyFormData.append('cc_112', '0');

    try {
      const response = await InsertPegawai(bodyFormData);

      if (response.error === true) {
        notifyerror(response.pesan);
      } else {
        handleClose();
        notifysuccess(response.pesan);
        getDataPegawai();
        setMainInput(cloneDeep(form));
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.message);
    }
  };


  const handleUpdate = async () => {
    if (!selectedData) return

    const { id_offpegawai } = selectedData
    const { name_offpegawai } = selectedData
    const { alias_offpegawai } = selectedData
    const { nip_offpegawai } = selectedData
    const { id_golongan } = selectedData
    const { id_jabatan } = selectedData
    const { id_bidang } = selectedData
    const { id_bidangsub } = selectedData
    const { str_pswd } = selectedData
    const { plt_bidang } = selectedData
    const { plt_bidangsub } = selectedData
    const { cc_112 } = selectedData

    const bodyFormData = new FormData()

    bodyFormData.append('id_offpegawai', id_offpegawai)
    bodyFormData.append('name_offpegawai', name_offpegawai)
    bodyFormData.append('alias_offpegawai', alias_offpegawai)
    bodyFormData.append('nip_offpegawai', nip_offpegawai)
    bodyFormData.append('id_golongan', id_golongan)
    bodyFormData.append('id_jabatan', id_jabatan)
    bodyFormData.append('id_bidang', id_bidang)
    bodyFormData.append('id_bidangsub', id_bidangsub)
    bodyFormData.append('str_pswd', str_pswd ?? '')
    bodyFormData.append('plt_bidang', plt_bidang)
    bodyFormData.append('plt_bidangsub', plt_bidangsub)
    bodyFormData.append('cc_112', cc_112)

    console.log(bodyFormData, 'tes update');
    try {
      const response = await UpdateSuperadminPegawai(bodyFormData);

      if (response.error === true) {
        notifyerror(response.pesan);
      } else {
        handleCloseEdit();
        notifysuccess(response.pesan);
        setTimeout(() => {
          setLoading(false);
          setDataLoaded(true);
          getDataPegawai();
        }, 700);
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.message);
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const handleClickOpenDelete = (id_offpegawai: any) => {
    setDelete(id_offpegawai)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const getDataPegawai = async () => {
    try {
      const responseData = await GetPegawai(
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offpegawai }))
        setDataPegawai(tmpData)
        setDataPegawaiFilter(tmpData)
        console.log('data dari database', dataPegawai)

        return tmpData
      } else {
        setDataPegawai(null)
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Superadmin</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                Kelola Data Pegawai
              </span>
            </>
          }
          style={{ backgroundColor: '#AFE1AF', textAlign: 'center' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <TextField
          label="Cari Pegawai"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <Button
          variant='outlined'
          onClick={() => {
            setOpen(true)
          }}
          sx={{
            backgroundColor: '#50C878',
            color: 'black',
            marginBottom: '10px',
            borderColor: '#03C04A',
            '&:hover': {
              color: 'black' // Warna teks saat tombol dihover
            }
          }}
        >
          Tambah Data Pegawai
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle
            style={{ textAlign: 'center', backgroundColor: '#50C878', marginTop: '-15px', fontSize: '20px' }}
          >
            Tambah Data Pegawai
          </DialogTitle>
          <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Pegawai:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Nama Lengkap'
                    fullWidth
                    value={mainInput.name_offpegawai}
                    onChange={$event => setMainInput({ ...mainInput, name_offpegawai: $event.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Alias:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Nama Alias'
                    fullWidth
                    value={mainInput.alias_offpegawai}
                    onChange={$event => setMainInput({ ...mainInput, alias_offpegawai: $event.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    NIP:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan NIP'
                    fullWidth
                    value={mainInput.nip_offpegawai}
                    onChange={$event => setMainInput({ ...mainInput, nip_offpegawai: $event.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Nama Golongan:
                  </Typography>
                  <RadioGroup
                    aria-label='golongan'
                    name='golongan'
                    value={mainInput.id_golongan}
                    onChange={e => setMainInput({ ...mainInput, id_golongan: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {golonganOptions.map(golongan => (
                      <FormControlLabel key={golongan.id_golongan} value={golongan.id_golongan} control={<Radio />} label={golongan.name_golongan} />
                    ))}
                  </RadioGroup>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Nama Jabatan:
                  </Typography>
                  <RadioGroup
                    aria-label='jabatan'
                    name='jabatan'
                    value={mainInput.id_jabatan}
                    onChange={e => setMainInput({ ...mainInput, id_jabatan: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {jabatanOptions.map(jabatan => (
                      <FormControlLabel key={jabatan.id_jabatan} value={jabatan.id_jabatan} control={<Radio />} label={jabatan.name_jabatan} />
                    ))}
                  </RadioGroup>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Nama Bidang:
                  </Typography>
                  <RadioGroup
                    aria-label='bidang'
                    name='bidang'
                    value={mainInput.id_bidang}
                    onChange={e => setMainInput({ ...mainInput, id_bidang: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {bidangOptions.map(bidang => (
                      <FormControlLabel key={bidang.id_bidang} value={bidang.id_bidang} control={<Radio />} label={bidang.name_bidang} />
                    ))}
                  </RadioGroup>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Nama Sub Bidang:
                  </Typography>
                  <RadioGroup
                    aria-label='sub_bidang'
                    name='sub_bidang'
                    value={mainInput.id_bidangsub}
                    onChange={e => setMainInput({ ...mainInput, id_bidangsub: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {bidangsubOptions.map(subBidang => (
                      <FormControlLabel key={subBidang.id_bidangsub} value={subBidang.id_bidangsub} control={<Radio />} label={subBidang.name_bidangsub} />
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpload}>Tambah</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle
            style={{ textAlign: 'center', backgroundColor: '#FFA500', marginTop: '-15px', fontSize: '20px' }}
          >
            Edit Data Pegawai
          </DialogTitle>
          <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
          <DialogContent>
            {selectedData && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Pegawai:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Nama Pegawai'
                    fullWidth
                    value={selectedData.name_offpegawai}
                    onChange={e => setSelectedData({ ...selectedData, name_offpegawai: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Alias Pegawai:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Nama AliasPegawai'
                    fullWidth
                    value={selectedData.alias_offpegawai}
                    onChange={e => setSelectedData({ ...selectedData, alias_offpegawai: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Bidang:
                  </Typography>
                  <RadioGroup
                    aria-label="bidang"
                    name="bidang"
                    value={selectedData.id_bidang || ''} // Gunakan id_bidang dari selectedData
                    onChange={e => setSelectedData({ ...selectedData, id_bidang: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {bidangOptions.map((bidang) => (
                      <FormControlLabel
                        key={bidang.id_bidang}
                        value={bidang.id_bidang} // Menyimpan name_bidang sebagai value
                        control={<Radio />}
                        label={bidang.name_bidang} // Menampilkan nama bidang sebagai label
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Sub Bidang:
                  </Typography>
                  <RadioGroup
                    aria-label="bidang sub"
                    name="bidang sub"
                    value={selectedData.id_bidangsub || ''} // Gunakan id_bidangsub dari selectedData
                    onChange={e => setSelectedData({ ...selectedData, id_bidangsub: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {bidangsubOptions.map((bidangsub) => (
                      <FormControlLabel
                        key={bidangsub.id_bidangsub}
                        value={bidangsub.id_bidangsub} // Menyimpan name_bidangsub sebagai value
                        control={<Radio />}
                        label={bidangsub.name_bidangsub} // Menampilkan nama bidang sebagai label
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Golongan:
                  </Typography>
                  <RadioGroup
                    aria-label="golongan"
                    name="golongan"
                    value={selectedData.id_golongan || ''} // Gunakan id_golongan dari selectedData
                    onChange={e => setSelectedData({ ...selectedData, id_golongan: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {golonganOptions.map((golongan) => (
                      <FormControlLabel
                        key={golongan.id_golongan}
                        value={golongan.id_golongan} // Menyimpan name_golongan sebagai value
                        control={<Radio />}
                        label={golongan.name_golongan} // Menampilkan nama bidang sebagai label
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Jabatan:
                  </Typography>
                  <RadioGroup
                    aria-label="jabatan"
                    name="jabatan"
                    value={selectedData.id_jabatan || ''} // Gunakan id_jabatan dari selectedData
                    onChange={e => setSelectedData({ ...selectedData, id_jabatan: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    {jabatanOptions.map((jabatan) => (
                      <FormControlLabel
                        key={jabatan.id_jabatan}
                        value={jabatan.id_jabatan} // Menyimpan name_jabatan sebagai value
                        control={<Radio />}
                        label={jabatan.name_jabatan} // Menampilkan nama bidang sebagai label
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    NIP:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan NIP'
                    fullWidth
                    value={selectedData.nip_offpegawai}
                    onChange={e => setSelectedData({ ...selectedData, nip_offpegawai: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant="body1" style={{ marginRight: '21px' }}>
                    Password:
                  </Typography>
                  <CustomTextField
                    placeholder="Masukkan Password"
                    fullWidth
                    type="password" // Tambahkan tipe password
                    // value={selectedData.str_pswd}
                    onChange={(e) => setSelectedData({ ...selectedData, str_pswd: e.target.value })}
                    style={{
                      width: '530px',
                    }}
                  />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleUpdate}>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Apakah anda Yakin Untuk Menghapus Data ini?'}</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button onClick={() => handleDeleteClick(Delete)}>Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <CircularProgress color='success' />
          <p>Loading...</p>
        </div>
      )}
      {dataLoaded && dataPegawai ? (
        <DataGrid
          autoHeight
          disableColumnFilter
          columns={columns}
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={dataPegawai}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.125rem'
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#FAF9F6'
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'white'
            },
            '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0' // Add right border to each header cell
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #e0e0e0' // Add right border to each cell
            }
          }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            }
          }}
        />
      ) : (
        <Grid item xs={12}>
          <Box
            borderRadius={2}
            p={2}
            textAlign='center'
            width='100%'
            minHeight='250px'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Box borderRadius={1}>
              <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                Tidak ada Data Pegawai
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
    </Card>
  )
}

export default TableKelolaPegawai

// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
import { DataMdRutinitas } from 'src/models/data-md-rutinitas'
import { DeleteDataPostKeg, GetDataKegById, InsertDataPostKeg, UpdateDataPostKeg } from 'src/store/module-rutinitas'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import cloneDeep from 'clone-deep'
import dayjs, { Dayjs } from 'dayjs'
import { useDropzone } from 'react-dropzone'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import usedecodetoken from 'src/utils/decodecookies'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeColor } from 'src/@core/layouts/types'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import { baseURL } from 'src/utils/api'
import { CircularProgress, Grid } from '@mui/material'

interface FileProp {
  name: string
  type: string
  size: number
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const TableRatingPegawai = () => {
  const userStatusObj: UserStatusType = {
    '0': 'warning', // Belum Diterima
    '1': 'success', // Diterima
    '2': 'error' // Sudah Selesai
  }

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

  const notifywarning = (msg: any) => {
    toast.warn(msg, {
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

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      '/*': ['.', '.']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      notifywarning('You can only upload 1 files & maximum size of 2 MB.')
    }
  })

  const form = {
    id_offpegawai: '',
    id_offkeg: '',
    tgl_offkeg: '',
    jam_offkeg: '',
    jam_offkeg2: '',
    cap_offkeg: '',
    note_offkeg: '',
    namaFileFoto: '',
    str_file: '',
    fileFoto: null
  }
  const [mainInput, setMainInput] = useState(cloneDeep(form))
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(new AdapterDayjs().date())
  const [beforeselectedTime, setBeforeSelectedTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'))
  const [afterselectedTime, setAfterSelectedTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'))
  const [files, setFiles] = useState<File[]>([])
  const [dataRutinitas, setDataRutinitas] = useState<any>()
  const [open, setOpen] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [Delete, setDelete] = useState<string>('') as [string, React.Dispatch<React.SetStateAction<string>>]
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [selectedData, setSelectedData] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const selectedDate2 = useRef<Dayjs | null>(new AdapterDayjs().date())
  const [loading, setLoading] = useState<boolean>(false)

  const handleDateChange = async (date: Dayjs | null) => {
    setLoading(true) // Set loading to true when starting to fetch data
    selectedDate2.current = date
    await fetchData(() => getDataRutinitas(date))
  }

  const fetchData = async (getDataFunction: () => Promise<void>) => {
    try {
      // Execute the data retrieval function
      await getDataFunction()
    } finally {
      // Set loading to false after a delay of 3 seconds
      setTimeout(() => {
        setLoading(false)
        setDataLoaded(true)
      }, 700)
    }
  }

  useEffect(() => {
    // Function to get data
    const fetchData = async () => {
      setLoading(true);
      try {
        await getDataRutinitas(selectedDate2.current);
      } finally {
        // Set loading to false after a delay of 3 seconds
        setTimeout(() => {
          setLoading(false);
          setDataLoaded(true);
        }, 700);
      }
    };

    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleAvatarClick = (imageUrl: any) => {
    setCurrentImage(imageUrl)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleDeleteClick = (id_offkeg: string) => {
    DeleteDataPostKeg(id_offkeg)
      .then(response => {
        notifysuccess(response.pesan)
        getDataRutinitas(selectedDate2.current)
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
        const row: DataMdRutinitas = params.row

        if (row.code_assign === 0 || row.code_assign === 2) {
          return (
            <>
              <Button
                onClick={() => {
                  setOpenEdit(true)
                  console.log('data edit', row)

                  // Parse the string into a Dayjs instance
                  const tglOffkegDate = dayjs(row.tgl_offkeg)
                  const jamOffkegTime = dayjs(row.jam_offkeg, 'HH:mm')
                  const jamOffkegTime2 = dayjs(row.jam_offkeg2, 'HH:mm')

                  if (tglOffkegDate.isValid()) {
                    setSelectedDate(tglOffkegDate)
                  } else {
                    console.error('Invalid date format:', row.tgl_offkeg)
                  }

                  if (jamOffkegTime.isValid()) {
                    setBeforeSelectedTime(jamOffkegTime)
                  } else {
                    console.error('Invalid time format:', row.jam_offkeg)
                  }

                  if (jamOffkegTime2.isValid()) {
                    setAfterSelectedTime(jamOffkegTime2)
                  } else {
                    console.error('Invalid time format:', row.jam_offkeg2)
                  }

                  setSelectedData(row)
                }}
              >
                <Icon icon='mingcute:pencil-line' color='#FFA500' width='25' height='25' />
              </Button>
              <Button onClick={() => handleClickOpenDelete(row.id_offkeg)}>
                <Icon icon='solar:trash-bin-minimalistic-linear' color='#e3242b' width='25' height='25' hFlip={true} />
              </Button>
            </>
          )
        } else if (row.code_assign === 1) {
          // Return null or an empty fragment if code_assign is 1
          return <></>
        }
      }
    },
    {
      field: 'code_assign',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Status',
      flex: 0.2,
      minWidth: 165,
      renderCell(params) {
        const row: DataMdRutinitas = params.row
        const color = userStatusObj[row.code_assign.toString()] // Convert code_assign to string and access the corresponding color from userStatusObj
        const statusTitle = {
          '0': 'BELUM DITERIMA',
          '1': 'DISETUJUI',
          '2': 'DITOLAK'
        }[row.code_assign.toString()] // Map code_assign to the corresponding status title

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={statusTitle}
            color={color}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      field: 'tgl_offkeg',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Tanggal',
      flex: 0.2,
      minWidth: 125
    },
    {
      field: 'cap_offkeg',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Kegiatan',
      flex: 0.2,
      minWidth: 150
    },
    {
      field: 'note_offkeg',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Keterangan',
      flex: 0.2,
      minWidth: 250
    },
    {
      field: 'str_file',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Foto Kegiatan',
      flex: 0.2,
      minWidth: 250,
      renderCell(params) {
        const row: DataMdRutinitas = params.row
        const imageUrl =
          row.str_file && row.str_file.length > 0
            ? `${baseURL}/detailkeg/:?file=${row.str_file}`
            : '/images/diskominfo/user2.png'

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={imageUrl}
              alt={row.str_file}
              style={{
                width: '80px',
                height: '40px',
                cursor: 'pointer',
                marginRight: '10px',
                borderRadius: '5%',
                border: '1px solid grey',
                objectFit: 'cover'
              }}
              onClick={() => handleAvatarClick(imageUrl)}
            />
          </div>
        )
      }
    },
    {
      field: 'jam_offkeg',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Waktu Mulai',
      flex: 0.2,
      minWidth: 135
    },
    {
      field: 'jam_offkeg2',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Waktu Selesai',
      flex: 0.2,
      minWidth: 155
    }
  ]

  const handleUpload = async () => {
    const decodedtoken = usedecodetoken()

    const bodyFormData = new FormData()
    bodyFormData.append('id_offpegawai', decodedtoken?.id_offpegawai)
    bodyFormData.append('tgl_offkeg', selectedDate ? selectedDate.format('YYYY-MM-DD') : '')
    bodyFormData.append('jam_offkeg', beforeselectedTime ? beforeselectedTime.format('HH:mm:ss') : '')
    bodyFormData.append('jam_offkeg2', afterselectedTime ? afterselectedTime.format('HH:mm:ss') : '')
    bodyFormData.append('cap_offkeg', mainInput.cap_offkeg)
    bodyFormData.append('note_offkeg', mainInput.note_offkeg)

    // Tambahkan file jika ada
    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_file`, file)
      })
    }
    try {
      const response = await InsertDataPostKeg(bodyFormData)

      if (response.error === true) {
        notifyerror(response.pesan)
      } else {
        handleClose()
        notifysuccess(response.pesan)
        getDataRutinitas(selectedDate2.current)
        setMainInput(cloneDeep(form))
        setSelectedDate(new AdapterDayjs().date())
        setFiles([])
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.pesan)
    }
  }

  const handleUpdate = async () => {
    const decodedtoken = usedecodetoken()
    if (!selectedData) return

    const id_offpegawai = decodedtoken?.id_offpegawai
    const { id_offkeg } = selectedData
    const tgl_offkeg = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''
    const jam_offkeg = beforeselectedTime ? beforeselectedTime.format('HH:mm:ss') : ''
    const jam_offkeg2 = afterselectedTime ? afterselectedTime.format('HH:mm:ss') : ''
    const { cap_offkeg } = selectedData
    const { note_offkeg } = selectedData

    const bodyFormData = new FormData()

    bodyFormData.append('id_offpegawai', id_offpegawai)
    bodyFormData.append('id_offkeg', id_offkeg)
    bodyFormData.append('tgl_offkeg', tgl_offkeg)
    bodyFormData.append('jam_offkeg', jam_offkeg)
    bodyFormData.append('jam_offkeg2', jam_offkeg2)
    bodyFormData.append('cap_offkeg', cap_offkeg)
    bodyFormData.append('note_offkeg', note_offkeg)
    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_file`, file)
      })
    }

    try {
      const response = await UpdateDataPostKeg(bodyFormData)
      handleCloseEdit()
      notifysuccess(response.pesan)
      getDataRutinitas(selectedDate2.current)
    } catch (ex: any) {
      // notifyerror(ex.response.data.pesan)
      // Handle the error
      // console.error(ex)
    }
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='fa6-regular:file-lines' width='50' height='50' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? (Math.round(file.size / 100) / 10000).toFixed(1) + ' MB'
              : (Math.round(file.size / 100) / 10).toFixed(1) + ' kb'}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        {/* <Icon icon='tabler:x' fontSize={20} /> */}
        <Icon icon='ph:x-circle-light' width='30' height='30' />
      </IconButton>
    </ListItem>
  ))

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const handleClickOpenDelete = (id_offkeg: any) => {
    setDelete(id_offkeg)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const getDataRutinitas = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetDataKegById(
        decodedtoken?.id_offpegawai,
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offkeg }))
        setDataRutinitas(tmpData)
      } else {
        setDataRutinitas(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDataRutinitas(selectedDate2.current), setSelectedDate(new AdapterDayjs().date())
  }, [])

  return (
    <Card>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Superadmin</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                Data Rating Pegawai Per Bulan
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

export default TableRatingPegawai

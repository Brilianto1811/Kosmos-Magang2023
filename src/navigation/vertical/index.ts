// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [ //admin Ahmad Nuruzzaman id_offpegawai = 62
    {
      sectionTitle: 'Menu'
    },
    {
      title: 'Dashboard',
      icon: 'tabler:chart-bar',
      path: '/asn/dashboard',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Dashboard',
      icon: 'tabler:chart-bar',
      path: '/nonasn/dashboard',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Daftar Tugas',
      icon: 'tabler:clipboard-list',
      path: '/asn/daftar_tugas',
      id_jabatan: ['2', '3', '4', '5', '6', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Daftar Tugas',
      icon: 'tabler:clipboard-list',
      path: '/nonasn/daftar_tugas',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Rutinitas',
      icon: 'tabler:list-check',
      path: '/asn/rutinitas',
      id_jabatan: ['2', '3', '4', '5', '6', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Rutinitas',
      icon: 'tabler:list-check',
      path: '/nonasn/rutinitas',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Penugasan',
      icon: 'tabler:briefcase',
      path: '/asn/penugasan',
      id_jabatan: ['1', '2', '3', '4', '5', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Validasi',
      icon: 'tabler:checklist',
      path: '/asn/validasi',
      id_jabatan: ['1', '2', '3', '4', '5', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Agenda',
      icon: 'tabler:calendar-event',
      path: '/asn/agenda',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Agenda',
      icon: 'tabler:calendar-event',
      path: '/nonasn/agenda',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Laporan Kinerja',
      icon: 'tabler:clipboard-text',
      path: '/nonasn/laporan_kinerja',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Gallery Kegiatan',
      icon: 'tabler:photo',
      path: '/asn/gallery_rutinitas',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11'],
      id_offpegawai: [''],
    },
    {
      title: 'Gallery Kegiatan',
      icon: 'tabler:photo',
      path: '/nonasn/gallery_rutinitas',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62', 'orang orangan sawah'],
    },
    {
      title: 'Rating Pegawai',
      icon: 'tabler:photo',
      path: '/nonasn/superadmin/rating_pegawai',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62'],

    },
    {
      title: 'Log Presensi',
      icon: 'tabler:photo',
      path: '/nonasn/superadmin/log_presensi',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62'],

    },
    {
      title: 'Kelola Data Pegawai',
      icon: 'tabler:photo',
      path: '/nonasn/superadmin/kelola_pegawai',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62'],

    },
    {
      title: 'Kelola Report OS',
      icon: 'tabler:photo',
      path: '/nonasn/superadmin/kelola_reportos',
      id_jabatan: ['10', '11'],
      id_offpegawai: ['62'],

    },
  ]
}

export default navigation

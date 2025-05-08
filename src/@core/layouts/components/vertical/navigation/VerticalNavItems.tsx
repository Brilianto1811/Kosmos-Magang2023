// ** Type Imports
import { NavLink, NavGroup, LayoutProps, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import { useEffect, useState } from 'react'
import usedecodetoken from 'src/utils/decodecookies'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  // console.log(item)
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  const { verticalNavItems } = props

  // State untuk menyimpan item-menu yang akan ditampilkan
  const [filteredNavItems, setFilteredNavItems] = useState<any>([])

  useEffect(() => {
    const decodedtoken = usedecodetoken();
    const non_asn = ['10', '11']
    console.log(decodedtoken);

    // Filter item-menu sesuai dengan id_jabatan dan id_offpegawai
    let filteredItems = verticalNavItems?.filter(
      (item: any) =>
        item.id_jabatan && item.id_jabatan.includes(decodedtoken?.id_jabatan)
        &&
        item.id_offpegawai && item.id_offpegawai.includes(decodedtoken?.id_offpegawai)
    );
    if (decodedtoken?.id_offpegawai.toString() != '62') {
      filteredItems = verticalNavItems?.filter(
        (item: any) =>
          item.id_jabatan && item.id_jabatan.includes(decodedtoken?.id_jabatan) &&
          item.id_offpegawai && item.id_offpegawai.includes("orang orangan sawah")
      );
      if (!non_asn.includes(decodedtoken?.id_jabatan.toString())) {
        filteredItems = verticalNavItems?.filter(
          (item: any) =>
            item.id_jabatan && item.id_jabatan.includes(decodedtoken?.id_jabatan)
        );
      }
    }

    setFilteredNavItems(filteredItems);
  }, [verticalNavItems]);

  const RenderMenuItems = filteredNavItems.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveNavItemComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems

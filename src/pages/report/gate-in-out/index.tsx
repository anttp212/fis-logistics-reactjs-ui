import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { PageWrapper } from '@components'
import {
  FISButton,
  FISInputDate,
  FISInputText,
  FISTable,
  FISTableCell,
  FISTableHeaderCell,
  FISSelect,
  FISPagination
} from 'fis-component'
import { ROUTES } from '@constants'

interface GateInOutRecordI {
  key: string
  stt: number
  name: string
  type: string
  vehicleType: string
  plateNumber: string
  timeIn: string
  timeOut: string
  status: string
}

const LOAI_HINH_OPTIONS = [
  { items: [{ label: 'Tất cả', value: '' }, { label: 'Vào cổng', value: 'vao' }, { label: 'Ra cổng', value: 'ra' }] }
]

const DUMMY_DATA: GateInOutRecordI[] = [
  { key: '1', stt: 1, name: 'Nguyễn Văn A', type: 'Vào', vehicleType: 'Container', plateNumber: '51C-12345', timeIn: '08:00', timeOut: '—', status: 'Đang trong khu vực' },
  { key: '2', stt: 2, name: 'Trần Văn B', type: 'Ra', vehicleType: 'Xe tải', plateNumber: '59A-67890', timeIn: '07:30', timeOut: '09:15', status: 'Đã ra' },
  { key: '3', stt: 3, name: 'Lê Thị C', type: 'Vào', vehicleType: 'Container', plateNumber: '30B-11111', timeIn: '09:00', timeOut: '—', status: 'Đang trong khu vực' },
  { key: '4', stt: 4, name: 'Phạm Văn D', type: 'Ra', vehicleType: 'Xe đầu kéo', plateNumber: '51C-22222', timeIn: '06:45', timeOut: '08:30', status: 'Đã ra' },
  { key: '5', stt: 5, name: 'Hoàng Văn E', type: 'Vào', vehicleType: 'Xe tải', plateNumber: '59A-33333', timeIn: '10:00', timeOut: '—', status: 'Đang trong khu vực' }
]

const GateInOutReport = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      fromDate: null as Date | null,
      toDate: null as Date | null,
      loaiHinh: '',
      search: ''
    }
  })

  const filterValues = watch()

  const handleFilter = handleSubmit(() => {
    setPage(1)
  })

  const filteredData = useMemo(() => {
    let data = [...DUMMY_DATA]
    if (filterValues.search) {
      const s = String(filterValues.search).toLowerCase()
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.plateNumber.toLowerCase().includes(s)
      )
    }
    if (filterValues.loaiHinh) {
      data = data.filter((r) =>
        filterValues.loaiHinh === 'vao' ? r.type === 'Vào' : r.type === 'Ra'
      )
    }
    return data
  }, [filterValues])

  const totalIn = useMemo(() => filteredData.filter((r) => r.type === 'Vào').length, [filteredData])
  const totalOut = useMemo(() => filteredData.filter((r) => r.type === 'Ra').length, [filteredData])
  const totalInside = useMemo(
    () => filteredData.filter((r) => r.status === 'Đang trong khu vực').length,
    [filteredData]
  )

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize).map((r, i) => ({
      ...r,
      stt: start + i + 1
    }))
  }, [filteredData, page, pageSize])

  const columns = [
    {
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={String(row.stt)} textAlign='center' />
      )
    },
    {
      dataIndex: 'name',
      key: 'name',
      width: 150,
      title: () => <FISTableHeaderCell label='TÊN ĐỐI TƯỢNG' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.name} textAlign='left' />
      )
    },
    {
      dataIndex: 'type',
      key: 'type',
      width: 100,
      title: () => <FISTableHeaderCell label='LOẠI HÌNH' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.type} textAlign='left' />
      )
    },
    {
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 120,
      title: () => <FISTableHeaderCell label='LOẠI XE' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.vehicleType} textAlign='left' />
      )
    },
    {
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 120,
      title: () => <FISTableHeaderCell label='BIỂN SỐ' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.plateNumber} textAlign='left' />
      )
    },
    {
      dataIndex: 'timeIn',
      key: 'timeIn',
      width: 100,
      title: () => <FISTableHeaderCell label='GIỜ VÀO' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.timeIn} textAlign='left' />
      )
    },
    {
      dataIndex: 'timeOut',
      key: 'timeOut',
      width: 100,
      title: () => <FISTableHeaderCell label='GIỜ RA' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.timeOut} textAlign='left' />
      )
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='TRẠNG THÁI' />,
      render: (_: unknown, row: GateInOutRecordI) => (
        <FISTableCell content={row.status} textAlign='left' />
      )
    }
  ]

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Báo cáo Ra/Vào cổng' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Báo cáo Ra/Vào cổng'
      breadcrumbItems={breadcrumbItems}
    >
      <div className='flex flex-col gap-6'>
        {/* Filter */}
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <div className='flex flex-nowrap items-end gap-4 overflow-x-auto'>
            <div className='flex-shrink-0'>
            <Controller
              name='fromDate'
              control={control}
              render={({ field }) => (
                <FISInputDate
                  textLabel='Từ ngày'
                  placeholder='dd/mm/yyyy'
                  value={field.value}
                  onChange={field.onChange}
                  picker='date'
                  format='DD/MM/YYYY'
                />
              )}
            />
            </div>
            <div className='flex-shrink-0'>
            <Controller
              name='toDate'
              control={control}
              render={({ field }) => (
                <FISInputDate
                  textLabel='Đến ngày'
                  placeholder='dd/mm/yyyy'
                  value={field.value}
                  onChange={field.onChange}
                  picker='date'
                  format='DD/MM/YYYY'
                />
              )}
            />
            </div>
            <div className='flex-shrink-0'>
            <Controller
              name='loaiHinh'
              control={control}
              render={({ field }) => (
                <FISSelect
                  textLabel='Loại hình'
                  placeholder='Chọn loại hình'
                  options={LOAI_HINH_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            </div>
            <div className='flex-shrink-0 min-w-[200px]'>
            <Controller
              name='search'
              control={control}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  textLabel='Tìm kiếm'
                  placeholder='Tên, biển số xe'
                />
              )}
            />
            </div>
            <div className='flex-shrink-0'>
            <FISButton variant='primary' onClick={handleFilter}>
              Lọc dữ liệu
            </FISButton>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Tổng lượt vào</p>
            <p className='text-2xl font-semibold text-blue-600'>{totalIn}</p>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Tổng lượt ra</p>
            <p className='text-2xl font-semibold text-green-600'>{totalOut}</p>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Đang ở trong khu vực</p>
            <p className='text-2xl font-semibold text-amber-600'>{totalInside}</p>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <FISTable
            dataSource={paginatedData}
            columns={columns}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
     <div className='p-4 mt-2 '>
            <FISPagination
              current={page}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={(p) => setPage(p)}
              onShowSizeChange={(_current, size) => {
                setPageSize(size || 10)
                setPage(1)
              }}
              showSizeChanger
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default GateInOutReport

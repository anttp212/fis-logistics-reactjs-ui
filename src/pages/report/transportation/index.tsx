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

interface TransportationRecordI {
  key: string
  stt: number
  orderCode: string
  driverName: string
  vehicleType: string
  plateNumber: string
  containerCode: string
  goods: string
  status: string
  startTime: string
  endTime: string
}

const TRANG_THAI_OPTIONS = [
  {
    items: [
      { label: 'Tất cả', value: '' },
      { label: 'Nhận lệnh', value: 'dang' },
      { label: 'Đã hoàn tất', value: 'hoan_tat' },
      { label: 'Sự cố/Delay', value: 'su_co' }
    ]
  }
]

const DUMMY_DATA: TransportationRecordI[] = [
  {
    key: '1',
    stt: 1,
    orderCode: 'LD-2024-001',
    driverName: 'Nguyễn Văn A',
    vehicleType: 'Container',
    plateNumber: '51C-12345',
    containerCode: 'TEMU1234567',
    goods: 'Gạo xuất khẩu',
    status: 'Đã hoàn tất',
    startTime: '08:00',
    endTime: '12:30'
  },
  {
    key: '2',
    stt: 2,
    orderCode: 'LD-2024-002',
    driverName: 'Trần Văn B',
    vehicleType: 'Xe tải',
    plateNumber: '59A-67890',
    containerCode: 'MSCU9876543',
    goods: 'Thép xây dựng',
    status: 'Nhận lệnh',
    startTime: '09:15',
    endTime: '—'
  },
  {
    key: '3',
    stt: 3,
    orderCode: 'LD-2024-003',
    driverName: 'Lê Thị C',
    vehicleType: 'Container',
    plateNumber: '30B-11111',
    containerCode: 'HLBU4567890',
    goods: 'Dệt may',
    status: 'Sự cố/Delay',
    startTime: '07:00',
    endTime: '—'
  },
  {
    key: '4',
    stt: 4,
    orderCode: 'LD-2024-004',
    driverName: 'Phạm Văn D',
    vehicleType: 'Xe đầu kéo',
    plateNumber: '51C-22222',
    containerCode: 'OOLU1112223',
    goods: 'Điện tử',
    status: 'Đã hoàn tất',
    startTime: '06:30',
    endTime: '10:45'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  },
  {
    key: '5',
    stt: 5,
    orderCode: 'LD-2024-005',
    driverName: 'Hoàng Văn E',
    vehicleType: 'Xe tải',
    plateNumber: '59A-33333',
    containerCode: 'CMAU7778889',
    goods: 'Xăng dầu',
    status: 'Nhận lệnh',
    startTime: '10:00',
    endTime: '—'
  }
]

const TransportationReport = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      fromDate: null as Date | null,
      toDate: null as Date | null,
      status: '',
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
          r.orderCode.toLowerCase().includes(s) ||
          r.containerCode.toLowerCase().includes(s) ||
          r.driverName.toLowerCase().includes(s)
      )
    }
    if (filterValues.status) {
      const statusMap: Record<string, string> = {
        dang: 'Nhận lệnh',
        hoan_tat: 'Đã hoàn tất',
        su_co: 'Sự cố/Delay'
      }
      const target = statusMap[filterValues.status]
      if (target) data = data.filter((r) => r.status === target)
    }
    return data
  }, [filterValues])

  const totalTransfer = filteredData.length
  const totalInTransit = useMemo(() => filteredData.filter((r) => r.status === 'Nhận lệnh').length, [filteredData])
  const totalCompleted = useMemo(() => filteredData.filter((r) => r.status === 'Đã hoàn tất').length, [filteredData])
  const totalIncident = useMemo(() => filteredData.filter((r) => r.status === 'Sự cố/Delay').length, [filteredData])

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
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={String(row.stt)} textAlign='center' />
    },
    {
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 140,
      title: () => <FISTableHeaderCell label='MÃ LỆNH/CHUYỂN' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.orderCode} textAlign='left' />
    },
    {
      dataIndex: 'driverName',
      key: 'driverName',
      width: 130,
      title: () => <FISTableHeaderCell label='Tên tài xế' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.driverName} textAlign='left' />
    },
    {
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 100,
      title: () => <FISTableHeaderCell label='Loại xe' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.vehicleType} textAlign='left' />
    },
    {
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 110,
      title: () => <FISTableHeaderCell label='Biển số' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.plateNumber} textAlign='left' />
    },
    {
      dataIndex: 'containerCode',
      key: 'containerCode',
      width: 130,
      title: () => <FISTableHeaderCell label='Mã container' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.containerCode} textAlign='left' />
    },
    {
      dataIndex: 'goods',
      key: 'goods',
      width: 130,
      title: () => <FISTableHeaderCell label='Hàng hóa' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.goods} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 140,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.status} textAlign='left' />
    },
    {
      dataIndex: 'startTime',
      key: 'startTime',
      width: 100,
      title: () => <FISTableHeaderCell label='Bắt đầu' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.startTime} textAlign='left' />
    },
    {
      dataIndex: 'endTime',
      key: 'endTime',
      width: 100,
      title: () => <FISTableHeaderCell label='Kết thúc' />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.endTime} textAlign='left' />
    }
  ]

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Báo cáo Vận Tải' }
  ]

  return (
    <PageWrapper className='py-5' title='Báo cáo Vận Tải' breadcrumbItems={breadcrumbItems}>
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
                name='status'
                control={control}
                render={({ field }) => (
                  <FISSelect
                    textLabel='Trạng thái'
                    placeholder='Chọn trạng thái'
                    options={TRANG_THAI_OPTIONS}
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
                  <FISInputText {...field} textLabel='Tìm kiếm' placeholder='Mã lệnh, cont, tài xế' />
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
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Tổng chuyến</p>
            <p className='text-2xl font-semibold text-gray-900'>{totalTransfer}</p>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Nhận lệnh</p>
            <p className='text-2xl font-semibold text-blue-600'>{totalInTransit}</p>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Đã hoàn tất</p>
            <p className='text-2xl font-semibold text-green-600'>{totalCompleted}</p>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <p className='text-sm text-gray-500'>Sự cố/Delay</p>
            <p className='text-2xl font-semibold text-red-600'>{totalIncident}</p>
          </div>
        </div>

        {/* Table */}
        <FISTable
          dataSource={paginatedData}
          scroll={{ y: 'calc(100vh - 530px)' }}
          columns={columns}
          pagination={false}
        />
        <div className='mt-2'>
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
    </PageWrapper>
  )
}

export default TransportationReport

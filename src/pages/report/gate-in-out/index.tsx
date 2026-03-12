import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { PageWrapper } from '@components'
import {
  FISButton,
  FISInputDate,
  FISTable,
  FISTableCell,
  FISTableHeaderCell,
  FISSelect,
  FISPagination
} from 'fis-component'
import { ROUTES } from '@constants'
import { useGetSecurityRegistrationsQuery, useExportSecurityRegistrationsMutation } from './gateInOut.api'
import type { SecurityRegistrationI } from './gateInOut.api'
import dayjs from '@utils/dayjs'
import { toBoundaryIsoString } from '@utils'

interface GateInOutRecordI {
  key: string
  stt: number
  type: string
  driverName: string
  vehicleType: string
  plateNo: string
  timeIn: string
  timeOut: string
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CONTAINER: 'Container',
  MOTORBIKE: 'Xe máy',
  TRUCK: 'Xe tải',
  TRAILER: 'Xe đầu kéo',
  CAR: 'Xe ô tô'
}

const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const LOAI_HINH_OPTIONS = [
  {
    items: [
      { label: 'Tất cả', value: '' },
      { label: 'Chờ', value: 'PENDING' },
      { label: 'Ra cổng', value: 'CHECKED_OUT' },
      { label: 'Vào cổng', value: 'CHECKED_IN' }
    ]
  }
]

const VEHICLE_TYPE_OPTIONS = [
  {
    items: [
      { label: 'Tất cả', value: '' },
      { label: 'Container', value: 'CONTAINER' },
      { label: 'Xe máy', value: 'MOTORBIKE' },
      { label: 'Xe tải', value: 'TRUCK' },
      { label: 'Xe ô tô', value: 'CAR' }
    ]
  }
]

const mapRegistrationToRecord = (r: SecurityRegistrationI, stt: number): GateInOutRecordI => {
  const isCheckedOut = r.status === 'CHECKED_OUT'
  return {
    key: r.id,
    stt,
    driverName: r.driverName,
    type: r.status === 'PENDING' ? 'Chờ' : isCheckedOut ? 'Ra cổng' : 'Vào cổng',
    vehicleType: VEHICLE_TYPE_LABELS[r.vehicleType] ?? r.vehicleType,
    plateNo: r.plateNo,
    timeIn: formatDateTime(r.estimatedArrival ?? r.createdAt),
    timeOut: isCheckedOut ? formatDateTime(r.updatedAt) : '—'
  }
}

type GateInOutApiParamsT = {
  dateFrom?: string
  dateTo?: string
  status?: 'PENDING' | 'CHECKED_OUT' | 'CHECKED_IN'
  vehicleType?: string
  page?: number
  size?: number
}

type GateInOutFilterValuesT = {
  fromDate: Date | null
  toDate: Date | null
  status: string
  vehicleType: string
}

const GateInOutReport = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [appliedParams, setAppliedParams] = useState<GateInOutApiParamsT | null>(null)

  const defaultFilterValues = {
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: '',
    vehicleType: ''
  }

  const { control, handleSubmit, reset, setValue, watch } = useForm<GateInOutFilterValuesT>({
    defaultValues: defaultFilterValues
  })
  const selectedFromDate = watch('fromDate')
  const selectedFromDateMin = selectedFromDate ? dayjs(selectedFromDate) : undefined

  const queryParams = useMemo(
    () =>
      appliedParams
        ? {
            ...appliedParams,
            page,
            size: pageSize
          }
        : {
            page,
            size: pageSize
          },
    [appliedParams, page, pageSize]
  )

  const { data: listResponse, isLoading, isFetching } = useGetSecurityRegistrationsQuery(queryParams, {})

  const [exportExcel, { isLoading: isExporting }] = useExportSecurityRegistrationsMutation()

  const handleExportExcel = async () => {
    try {
      const blob = await exportExcel(appliedParams ?? undefined).unwrap()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bao-cao-ra-vao-cong-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Error handled by RTK Query
    }
  }

  const handleFilter = handleSubmit((values) => {
    const params: GateInOutApiParamsT = {
      dateFrom: values.fromDate ? toBoundaryIsoString(values.fromDate, 'start') : undefined,
      dateTo: values.toDate ? toBoundaryIsoString(values.toDate, 'end') : undefined,
      status: (values.status as 'PENDING' | 'CHECKED_OUT' | 'CHECKED_IN') || undefined,
      vehicleType: values.vehicleType || undefined
    }
    setAppliedParams(params)
    setPage(1)
  })

  const handleResetFilter = () => {
    reset(defaultFilterValues)
    setAppliedParams({})
    setPage(1)
  }

  const dataSource = useMemo(() => {
    const start = (page - 1) * pageSize
    return (listResponse?.data ?? []).map((r, i) => mapRegistrationToRecord(r, start + i + 1))
  }, [listResponse?.data, page, pageSize])

  const columns = [
    {
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={String(row.stt)} textAlign='center' />
    },
    {
      dataIndex: 'name',
      key: 'name',
      width: 150,
      title: () => <FISTableHeaderCell label='TÊN' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.driverName} textAlign='left' />
    },
    {
      dataIndex: 'type',
      key: 'type',
      width: 100,
      title: () => <FISTableHeaderCell label='LOẠI HÌNH' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.type} textAlign='left' />
    },
    {
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 120,
      title: () => <FISTableHeaderCell label='LOẠI XE' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.vehicleType} textAlign='left' />
    },
    {
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 120,
      title: () => <FISTableHeaderCell label='BIỂN SỐ' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.plateNo} textAlign='left' />
    },
    {
      dataIndex: 'timeIn',
      key: 'timeIn',
      width: 100,
      title: () => <FISTableHeaderCell label='GIỜ VÀO' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.timeIn} textAlign='left' />
    },
    {
      dataIndex: 'timeOut',
      key: 'timeOut',
      className: 'none-border-right',
      width: 100,
      title: () => <FISTableHeaderCell label='GIỜ RA' hasRightDivider />,
      render: (_: unknown, row: GateInOutRecordI) => <FISTableCell content={row.timeOut} textAlign='left' />
    }
  ]

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Báo cáo Ra/Vào cổng' }
  ]

  return (
    <PageWrapper className='py-5 ' title='Báo cáo Ra/Vào cổng' breadcrumbItems={breadcrumbItems}>
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
                    placeholder='Chọn ngày'
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      setValue('toDate', null)
                    }}
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
                    placeholder='Chọn ngày'
                    value={field.value}
                    onChange={field.onChange}
                    minDate={selectedFromDateMin}
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
                name='vehicleType'
                control={control}
                render={({ field }) => (
                  <FISSelect
                    textLabel='Loại xe'
                    placeholder='Chọn loại xe'
                    options={VEHICLE_TYPE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className='flex-shrink-0'>
              <FISButton variant='primary' onClick={handleFilter}>
                Lọc dữ liệu
              </FISButton>
            </div>
            <div className='flex-shrink-0'>
              <FISButton variant='secondary' onClick={handleResetFilter}>
                <ReloadOutlined />
                <span className='sr-only'>Reset bộ lọc</span>
              </FISButton>
            </div>
            <div className='flex-shrink-0'>
              <FISButton
                variant='secondary'
                startIcon={<DownloadOutlined />}
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                Xuất Excel
              </FISButton>
            </div>
          </div>
        </div>

        {/* Table */}
        <FISTable
          dataSource={dataSource}
          columns={columns}
          loading={isLoading || isFetching}
          scroll={{ y: 'calc(100vh - 430px)' }}
          pagination={false}
          rowKey={(row) => `${row.key}-${row.stt}`}
        />
        <div>
          <FISPagination
            current={page}
            pageSize={pageSize}
            total={listResponse?.pagination?.totalElements ?? 0}
            onChange={(p) => setPage(p)}
            onShowSizeChange={(_current, _size) => {
              setPageSize(_current || 10)
              setPage(1)
            }}
            showSizeChanger
          />
        </div>
      </div>
    </PageWrapper>
  )
}

export default GateInOutReport

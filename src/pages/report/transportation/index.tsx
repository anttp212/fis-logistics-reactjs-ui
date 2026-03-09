import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { PageWrapper } from '@components'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
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
import {
  useGetTransportReportQuery,
  useExportTransportReportMutation
} from '@pages/transportation/vehicle-dispatch/vehicleDispatch.api'
import type {
  DispatchOrderApiI,
  DispatchOrderContainerI
} from '@pages/transportation/vehicle-dispatch/vehicleDispatch.api'
import { STATUS_LABELS, STATUS_OPTIONS } from '@pages/transportation/vehicle-dispatch/constants/status'

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

const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const mapOrderToRecord = (order: DispatchOrderApiI, stt: number): TransportationRecordI => {
  const c0 = order.containers?.[0] as DispatchOrderContainerI | undefined
  return {
    key: order.id,
    stt,
    orderCode: order.dispatchCode ?? '—',
    driverName: c0?.driverName ?? order.driverName ?? '—',
    vehicleType: order.vehicleTypeName ?? order.vehicleType ?? '—',
    plateNumber: c0?.driverPlateNo ?? order.vehiclePlateNo ?? '—',
    containerCode: c0?.containerNo ?? '—',
    goods: order.content ?? order.notes ?? '—',
    status: STATUS_LABELS[order.status ?? ''] ?? order.statusText ?? order.status ?? '—',
    startTime: formatDateTime(order.estimatedPickupTime ?? order.expectedPickupTime),
    endTime: formatDateTime(order.estimatedDeliveryTime ?? order.expectedDeliveryTime)
  }
}

type TransportReportApiParamsT = {
  dateFrom?: string
  dateTo?: string
  status?: string
  keyword?: string
  page?: number
  size?: number
}

type TransportReportFilterValuesT = {
  dateFrom: Date | null
  dateTo: Date | null
  status: string[]
  search: string
}

const toBoundaryIsoString = (date: Date, boundary: 'start' | 'end') => {
  const nextDate = new Date(date)
  if (boundary === 'start') {
    nextDate.setHours(0, 0, 0, 0)
  } else {
    nextDate.setHours(23, 59, 59, 999)
  }
  return nextDate.toISOString()
}

const TransportationReport = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [appliedParams, setAppliedParams] = useState<TransportReportApiParamsT | null>(null)

  const defaultFilterValues = {
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    status: [] as string[],
    search: ''
  }

  const { control, handleSubmit, reset, setValue, watch } = useForm<TransportReportFilterValuesT>({
    defaultValues: defaultFilterValues
  })
  const selectedFromDate = watch('dateFrom')
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

  const { data: listResponse, isLoading, isFetching } = useGetTransportReportQuery(queryParams, {})

  const [exportExcel, { isLoading: isExporting }] = useExportTransportReportMutation()

  const handleExportExcel = async () => {
    try {
      const blob = await exportExcel(appliedParams ?? undefined).unwrap()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bao-cao-van-tai-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Error handled by RTK Query
    }
  }

  const handleFilter = handleSubmit((values) => {
    const statusVal = Array.isArray(values.status)
      ? values.status?.filter(Boolean).join(',') || undefined
      : values.status || undefined
    const params: TransportReportApiParamsT = {
      dateFrom: values.dateFrom ? toBoundaryIsoString(values.dateFrom, 'start') : undefined,
      dateTo: values.dateTo ? toBoundaryIsoString(values.dateTo, 'end') : undefined,
      status: statusVal,
      keyword: values.search || undefined
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
    const offset = (page - 1) * pageSize

    return (listResponse?.data ?? []).map((o, i) => mapOrderToRecord(o, offset + i + 1))
  }, [listResponse?.data, page, pageSize])

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
      title: () => <FISTableHeaderCell label='TÊN TÀI XẾ' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.driverName} textAlign='left' />
    },
    {
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 100,
      title: () => <FISTableHeaderCell label='LOẠI XE' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.vehicleType} textAlign='left' />
    },
    {
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 110,
      title: () => <FISTableHeaderCell label='BIỂN SỐ' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.plateNumber} textAlign='left' />
    },
    {
      dataIndex: 'containerCode',
      key: 'containerCode',
      width: 130,
      title: () => <FISTableHeaderCell label='MÃ CONTAINER' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.containerCode} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 140,
      title: () => <FISTableHeaderCell label='TRẠNG THÁI' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.status} textAlign='left' />
    },
    {
      dataIndex: 'startTime',
      key: 'startTime',
      width: 100,
      title: () => <FISTableHeaderCell label='BẮT ĐẦU' hasRightDivider />,
      render: (_: unknown, row: TransportationRecordI) => <FISTableCell content={row.startTime} textAlign='left' />
    },
    {
      dataIndex: 'endTime',
      key: 'endTime',
      width: 100,
      className: 'none-border-right',
      title: () => <FISTableHeaderCell label='KẾT THÚC' />,
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
                name='dateFrom'
                control={control}
                render={({ field }) => (
                  <FISInputDate
                    textLabel='Từ ngày'
                    placeholder='Chọn ngày'
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      setValue('dateTo', null)
                    }}
                    picker='date'
                    format='DD/MM/YYYY'
                  />
                )}
              />
            </div>
            <div className='flex-shrink-0'>
              <Controller
                name='dateTo'
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
                    {...field}
                    textLabel='Trạng thái'
                    placeholder='Chọn trạng thái'
                    options={STATUS_OPTIONS}
                    removeSelectedText='Xóa lựa chọn'
                    multiDisplayText={(count) => `${count} lựa chọn`}
                    selectedGroupLabel='Đã chọn'
                    multi
                    hideChip={true}
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
          key={`${page}-${pageSize}-${listResponse?.pagination?.page ?? page}`}
          dataSource={dataSource}
          columns={columns}
          rowKey={(row) => `${row.key}-${row.stt}`}
          loading={isLoading || isFetching}
          scroll={{ y: 'calc(100vh - 430px)' }}
          pagination={false}
        />
        <div className='mt-2'>
          <FISPagination
            current={page}
            pageSize={pageSize}
            total={listResponse?.pagination?.totalElements ?? 0}
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

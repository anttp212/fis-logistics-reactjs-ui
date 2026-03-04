import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, buildVehicleDispatchDetailPath, buildVehicleDispatchEditPath } from '@constants'
import { PageWrapper, TableToolbar } from '@components'
import {
  FISBadge,
  FISButton,
  FISTable,
  FISTableCell,
  FISTableHeaderCell,
  FISIconButton,
  FISButtonGroup,
  FISPagination
} from 'fis-component'
import { AddIcon } from '@images'
import VehicleDispatchFilter from './components/VehicleDispatchFilter'
import { useVehicleDispatch } from './useVehicleDispatch'
import { useGetVehicleDispatchListQuery } from './vehicleDispatch.api'
import type { DispatchOrderApiI, DispatchOrderContainerI } from './vehicleDispatch.api'
import { useGetVehicleTypesQuery, useGetRequestingUnitsQuery, useGetLocationsQuery } from './vehicleDispatchMaster.api'

/** Row đã flatten: 1 dòng = 1 container */
interface FlattenedRowI extends DispatchOrderApiI {
  _orderId: string
  _orderIndex: number
  _containerIndex: number
  _container: DispatchOrderContainerI
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  IN_TRANSIT: 'Đang vận chuyển',
  COMPLETED: 'Hoàn thành',
  INCIDENT: 'Sự cố',
  CANCELLED: 'Huỷ'
}

type BadgeStatusT = 'caution' | 'info' | 'positive' | 'negative'
const STATUS_BADGE: Record<string, { label: string; status: BadgeStatusT }> = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', status: 'caution' },
  IN_TRANSIT: { label: 'Đang vận chuyển', status: 'info' },
  COMPLETED: { label: 'Hoàn thành', status: 'positive' },
  INCIDENT: { label: 'Sự cố', status: 'negative' },
  CANCELLED: { label: 'Huỷ', status: 'negative' }
}

/** Tạo lookup id -> name từ mảng API */
const toIdNameMap = (items: { id: string; name: string }[] | undefined): Record<string, string> =>
  Object.fromEntries((items ?? []).map((item) => [item.id, item.name]))

/** Format ISO date string sang dd/mm/yyyy HH:mm */
const formatDateTime = (isoStr?: string) => {
  if (!isoStr) return '-'
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/** Dòng thứ 2+ của cùng phiếu: chỉ hiển thị KÍCH THƯỚC, TRỌNG LƯỢNG, TÀI XẾ, action */
const isSubsequentContainerRow = (row: FlattenedRowI) => row._containerIndex >= 1

/** Flatten orders: mỗi container = 1 dòng, _orderIndex đánh từ 1 cho mỗi phiếu */
const flattenOrdersToRows = (orders: DispatchOrderApiI[]): FlattenedRowI[] => {
  const rows: FlattenedRowI[] = []
  orders.forEach((order, orderIdx) => {
    const orderIndex = orderIdx + 1
    rows.push({
      ...order,
      _orderId: order.id,
      _orderIndex: orderIndex,
      _containerIndex: 0,
      _container: {}
    })
  })
  return rows
}

const VehicleDispatchPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const vehicleDispatch = useVehicleDispatch()
  const filterValues = (vehicleDispatch as any).filters as Record<string, any>

  const { data: listResponse } = useGetVehicleDispatchListQuery({
    page,
    size: pageSize,
    keyword: vehicleDispatch.search || undefined,
    status: Array.isArray(filterValues?.status)
      ? (filterValues.status as string[]).filter((s) => s && s !== '')
      : filterValues?.status
        ? [filterValues.status]
        : undefined,
    vehicleTypeId: filterValues?.vehicleTypeId || undefined,
    dateFrom: filterValues?.dateFrom || undefined,
    dateTo: filterValues?.dateTo || undefined,
    depotCode: filterValues?.depotCode || undefined,
    driverId: filterValues?.driverId || undefined
  })

  useEffect(() => {
    setPage(1)
  }, [
    filterValues?.status,
    filterValues?.vehicleTypeId,
    filterValues?.dateFrom,
    filterValues?.dateTo,
    filterValues?.depotCode,
    filterValues?.driverId,
    vehicleDispatch.search
  ])
  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: requestingUnits = [] } = useGetRequestingUnitsQuery()
  const { data: locations = [] } = useGetLocationsQuery()
  // const { data: drivers = [] } = useGetDriversQuery()

  const vehicleTypeLabels = useMemo(() => toIdNameMap(vehicleTypes), [vehicleTypes])
  const requestingUnitLabels = useMemo(() => toIdNameMap(requestingUnits), [requestingUnits])
  const locationLabels = useMemo(() => toIdNameMap(locations), [locations])
  // const driverLabels = useMemo(() => toIdNameMap(drivers), [drivers])

  const dataSource = useMemo(() => flattenOrdersToRows(listResponse?.data ?? []), [listResponse?.data])

  const pagination = listResponse?.pagination
  const total = pagination?.totalElements ?? 0

  const handleViewDetail = (record: FlattenedRowI) => {
    navigate(buildVehicleDispatchDetailPath(record._orderId))
  }

  const handleEdit = (record: FlattenedRowI) => {
    navigate(buildVehicleDispatchEditPath(record._orderId))
  }

  // const handleAssignDriver = (record: FlattenedRowI) => {
  //   // navigate(buildVehicleDispatchDetailPath(record._orderId))
  // }

  const columns = [
    {
      key: 'index',
      width: 50,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => <FISTableCell content={String(row._orderIndex)} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 130,
      title: () => <FISTableHeaderCell label='TRẠNG THÁI' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => {
        const statusKey = row.status ?? ''
        const badgeConfig = STATUS_BADGE[statusKey]
        if (badgeConfig) {
          return (
            <FISTableCell
              content={<FISBadge label={badgeConfig.label} size='sm' status={badgeConfig.status} />}
              textAlign='left'
            />
          )
        }
        return <FISTableCell content={STATUS_LABELS[statusKey] ?? statusKey ?? '-'} textAlign='left' />
      }
    },
    {
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 120,
      title: () => <FISTableHeaderCell label='LOẠI XE' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={
            vehicleTypeLabels[row.vehicleType ?? row.vehicleTypeId ?? ''] ?? row.vehicleType ?? row.vehicleTypeId ?? '-'
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'origin',
      key: 'origin',
      width: 90,
      title: () => <FISTableHeaderCell label='ĐIỂM ĐI' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={
            locationLabels[row.origin ?? row.departureLocationId ?? ''] ?? row.origin ?? row.departureLocationId ?? '-'
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'destination',
      key: 'destination',
      width: 100,
      title: () => <FISTableHeaderCell label='ĐIỂM ĐẾN' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={
            locationLabels[row.destination ?? row.destinationLocationId ?? ''] ??
            row.destination ??
            row.destinationLocationId ??
            '-'
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'requestUnit',
      key: 'requestUnit',
      width: 110,
      title: () => <FISTableHeaderCell label='ĐƠN VỊ YC' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={
            requestingUnitLabels[row.requestUnit ?? row.requestingUnitId ?? ''] ??
            row.requestUnit ??
            row.requestingUnitId ??
            row.depotName ??
            '-'
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'containerCount',
      key: 'containerCount',
      width: 90,
      title: () => <FISTableHeaderCell label='SỐ LƯỢNG' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) =>
        isSubsequentContainerRow(row) ? (
          <FISTableCell content='' textAlign='left' />
        ) : (
          <FISTableCell content={String(row.containerCount ?? row.containers?.length ?? 0)} textAlign='left' />
        )
    },
    {
      dataIndex: 'expectedPickupTime',
      key: 'expectedPickupTime',
      width: 120,
      title: () => <FISTableHeaderCell label='TG NHẬN' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={formatDateTime(row.expectedPickupTime ?? row.estimatedPickupTime ?? row.dispatchDate)}
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'expectedDeliveryTime',
      key: 'expectedDeliveryTime',
      width: 120,
      title: () => <FISTableHeaderCell label='TG GIAO HÀNG' hasRightDivider />,
      render: (_: unknown, row: FlattenedRowI) => (
        <FISTableCell
          content={formatDateTime(row.expectedDeliveryTime ?? row.estimatedDeliveryTime)}
          textAlign='left'
        />
      )
    },
    {
      title: () => <FISTableHeaderCell label='THAO TÁC' />,
      key: 'actions',
      width: 140,
      render: (_: unknown, record: FlattenedRowI) => (
        <FISTableCell
          textAlign='right'
          icon={
            <FISButtonGroup
              size='md'
              options={[
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      }
                      variant='tertiary-invisible'
                      color='blue'
                      onClick={() => handleViewDetail(record)}
                    />
                  )
                },
                ...(record.status === 'PENDING_CONFIRMATION'
                  ? [
                      {
                        label: '',
                        startIcon: (
                          <FISIconButton
                            size='xs'
                            icon={
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                />
                              </svg>
                            }
                            variant='tertiary-invisible'
                            color='blue'
                            onClick={() => handleEdit(record)}
                          />
                        )
                      }
                    ]
                  : [])
                // {
                //   label: '',
                //   startIcon: (
                //     <FISIconButton
                //       size='xs'
                //       icon={
                //         <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                //           <path
                //             strokeLinecap='round'
                //             strokeLinejoin='round'
                //             strokeWidth={2}
                //             d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                //           />
                //         </svg>
                //       }
                //       variant='tertiary-invisible'
                //       color='blue'
                //       onClick={() => handleAssignDriver(record)}
                //     />
                //   )
                // }
              ]}
            />
          }
        />
      )
    }
  ]

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe' }
  ]

  return (
    <PageWrapper className='p-5' title='Điều xe' breadcrumbItems={breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          filterContent={<VehicleDispatchFilter control={vehicleDispatch.control} />}
          actionButtons={
            <FISButton startIcon={<AddIcon />} onClick={() => navigate(ROUTES.transportationVehicleDispatchCreate)}>
              Thêm mới
            </FISButton>
          }
          {...vehicleDispatch}
          searchPlaceholder='Điểm đi, điểm đến'
        />

        {/* <div className='flex-1 min-h-0 bg-white rounded-lg overflow-hidden p-4 flex flex-col'> */}
        <FISTable
          dataSource={dataSource}
          columns={columns}
          rowKey={(row) => `${row._orderId}-${row._containerIndex}`}
          scroll={{ y: 'calc(100vh - 350px)' }}
          pagination={false}
        />
        <div>
          <FISPagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p) => setPage(p)}
            onShowSizeChange={(_current, _size) => {
              setPageSize(_current)
              setPage(1)
            }}
            showSizeChanger
          />
        </div>
        {/* </div> */}
      </div>
    </PageWrapper>
  )
}

export default VehicleDispatchPage

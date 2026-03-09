import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTableToolbar } from '@hooks/useTableToolbar'
import {
  ROUTES,
  buildTransportationVehicleFleetDetailPath,
  buildTransportationVehicleFleetEditPath
} from '@constants'
import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import {
  FISBadge,
  FISButton,
  FISButtonGroup,
  FISPagination,
  FISTable,
  FISTableCell,
  FISTableHeaderCell
} from 'fis-component'
import {
  MOCK_FLEET_DATA,
  STATUS_BADGE,
  STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
  formatDate,
  getLogisticsLabel,
  type FleetItemI
} from './data'
import VehicleFleetFilter from './components/VehicleFleetFilter'

interface FleetFilterValuesI {
  status: string
  logisticsId: string
}

const VehicleFleetPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const tableToolbar = useTableToolbar<{ status: string; logisticsId: string }, FleetFilterValuesI>({
    defaultFilterValues: {
      status: '',
      logisticsId: ''
    }
  })
  const search = tableToolbar.search
  const status = tableToolbar.filters?.status || ''
  const logisticsId = tableToolbar.filters?.logisticsId || ''

  useEffect(() => {
    setPage(1)
  }, [search, status, logisticsId])

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return MOCK_FLEET_DATA.filter((item) => {
      const logisticsLabel = getLogisticsLabel(item.logisticsId).toLowerCase()
      const vehicleTypeLabel = VEHICLE_TYPE_LABELS[item.vehicleType].toLowerCase()
      const matchedKeyword =
        !keyword ||
        item.plateNumber.toLowerCase().includes(keyword) ||
        (item.secondaryPlateNumber || '').toLowerCase().includes(keyword) ||
        logisticsLabel.includes(keyword) ||
        vehicleTypeLabel.includes(keyword)

      const matchedStatus = !status || item.status === status
      const matchedLogistics = !logisticsId || item.logisticsId === logisticsId

      return matchedKeyword && matchedStatus && matchedLogistics
    })
  }, [logisticsId, search, status])

  const total = filteredData.length
  const dataSource = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize).map((item, index) => ({
      ...item,
      _index: start + index + 1
    }))
  }, [filteredData, page, pageSize])

  const columns = [
    {
      key: 'index',
      width: 60,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, row: FleetItemI & { _index: number }) => <FISTableCell content={String(row._index)} textAlign='left' />
    },
    {
      key: 'logistics',
      width: 180,
      title: () => <FISTableHeaderCell label='LOGISTICS' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => <FISTableCell content={getLogisticsLabel(row.logisticsId)} textAlign='left' />
    },
    {
      key: 'status',
      width: 140,
      title: () => <FISTableHeaderCell label='TRẠNG THÁI' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => {
        const badge = STATUS_BADGE[row.status]
        return badge
          ? <FISTableCell content={<FISBadge label={badge.label} size='sm' status={badge.status} />} textAlign='left' />
          : <FISTableCell content={STATUS_LABELS[row.status] ?? '-'} textAlign='left' />
      }
    },
    {
      key: 'vehicleType',
      width: 140,
      title: () => <FISTableHeaderCell label='LOẠI' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => <FISTableCell content={VEHICLE_TYPE_LABELS[row.vehicleType]} textAlign='left' />
    },
    {
      key: 'plateNumber',
      width: 140,
      title: () => <FISTableHeaderCell label='BIỂN SỐ' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => (
        <FISTableCell
          content={row.secondaryPlateNumber ? `${row.plateNumber} / ${row.secondaryPlateNumber}` : row.plateNumber}
          textAlign='left'
        />
      )
    },
    {
      key: 'payload',
      width: 110,
      title: () => <FISTableHeaderCell label='TẢI TRỌNG' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => <FISTableCell content={row.payload || '-'} textAlign='left' />
    },
    {
      key: 'weight',
      width: 120,
      title: () => <FISTableHeaderCell label='TRỌNG LƯỢNG' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => <FISTableCell content={row.weight || '-'} textAlign='left' />
    },
    {
      key: 'inspectionExpiry',
      width: 140,
      title: () => <FISTableHeaderCell label='HẠN ĐĂNG KIỂM' hasRightDivider />,
      render: (_: unknown, row: FleetItemI) => <FISTableCell content={formatDate(row.inspectionExpiry)} textAlign='left' />
    },
    {
      key: 'actions',
      className: 'none-border-right',
      width: 120,
      title: () => <FISTableHeaderCell label='THAO TÁC' />,
      render: (_: unknown, row: FleetItemI) => (
        <FISTableCell
          textAlign='right'
          icon={
            <FISButtonGroup
              size='md'
              options={[
                {
                  label: '',
                  startIcon: (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ),
                  onClick: () => navigate(buildTransportationVehicleFleetDetailPath(row.id))
                },
                {
                  label: '',
                  startIcon: (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  ),
                  onClick: () => navigate(buildTransportationVehicleFleetEditPath(row.id))
                }
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
    { label: 'Quản lý đội xe' }
  ]

  return (
    <PageWrapper className='py-5' title='Quản lý đội xe' breadcrumbItems={breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          control={tableToolbar.control}
          handleSearchChange={tableToolbar.handleSearchChange}
          handleSaveFilter={tableToolbar.handleSaveFilter}
          handleResetFilter={tableToolbar.handleResetFilter}
          loadSavedFilterValues={tableToolbar.loadSavedFilterValues}
          filterContent={<VehicleFleetFilter control={tableToolbar.control} />}
          filterTitle='Bộ lọc đội xe'
          search={tableToolbar.search}
          filters={tableToolbar.filters}
          searchPlaceholder='Tìm theo tên, biển số'
          actionButtons={
            <FISButton type='button' startIcon={<AddIcon />} onClick={() => navigate(ROUTES.transportationVehicleFleetCreate)}>
              Thêm mới
            </FISButton>
          }
        />

        <FISTable dataSource={dataSource} columns={columns} rowKey='id' scroll={{ y: 'calc(100vh - 320px)' }} pagination={false} />

        <div>
          <FISPagination
            current={page}
            pageSize={pageSize}
            total={total}
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

export default VehicleFleetPage

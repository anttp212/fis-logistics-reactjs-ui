import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTableToolbar } from '@hooks/useTableToolbar'
import {
  ROUTES,
  buildTransportationDriverManagementDetailPath,
  buildTransportationDriverManagementEditPath
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
import { STATUS_BADGE, STATUS_LABELS, formatDate, type DriverItemI } from './data'
import DriverManagementFilter from './components/DriverManagementFilter'
import { useGetDriverListQuery } from './driverManagement.api'

interface DriverFilterValuesI {
  status: string
  logisticsId: string
  createdDateFrom: string
  createdDateTo: string
}

const DriverManagementPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const tableToolbar = useTableToolbar<
    { status: string; logisticsId: string; createdDateFrom: string; createdDateTo: string },
    DriverFilterValuesI
  >({
    defaultFilterValues: {
      status: '',
      logisticsId: '',
      createdDateFrom: '',
      createdDateTo: ''
    }
  })
  const search = tableToolbar.search
  const status = tableToolbar.filters?.status || ''
  const logisticsId = tableToolbar.filters?.logisticsId || ''
  const createdDateFrom = tableToolbar.filters?.createdDateFrom || ''
  const createdDateTo = tableToolbar.filters?.createdDateTo || ''

  const listParams = useMemo(
    () => ({
      page,
      size: pageSize,
      keyword: search.trim() || undefined,
      status: status.trim() || undefined,
      logisticsId: logisticsId.trim() || undefined,
      createdDateFrom: createdDateFrom.trim() || undefined,
      createdDateTo: createdDateTo.trim() || undefined
    }),
    [page, pageSize, search, status, logisticsId, createdDateFrom, createdDateTo]
  )
  const { data: listResponse, isLoading: isListLoading, isFetching: isListFetching } = useGetDriverListQuery(listParams)

  useEffect(() => {
    setPage(1)
  }, [search, status, logisticsId, createdDateFrom, createdDateTo])

  const total = listResponse?.pagination?.totalElements ?? 0
  const dataSource = useMemo(() => {
    const start = (page - 1) * pageSize
    const items = listResponse?.data ?? []
    return items.slice(0, pageSize).map((item, index) => ({
      ...item,
      _index: start + index + 1
    }))
  }, [listResponse, page, pageSize])

  const columns = [
    {
      key: 'index',
      width: 60,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, row: DriverItemI & { _index: number }) => (
        <FISTableCell content={String(row._index)} textAlign='left' />
      )
    },
    {
      key: 'fullName',
      width: 180,
      title: () => <FISTableHeaderCell label='TÊN CÁ NHÂN' hasRightDivider />,
      render: (_: unknown, row: DriverItemI) => (
        <FISTableCell content={row.userFullName || row.fullName || '-'} textAlign='left' />
      )
    },
    {
      key: 'logistics',
      width: 180,
      title: () => <FISTableHeaderCell label='LOGISTICS' hasRightDivider />,
      render: (_: unknown, row: DriverItemI) => (
        <FISTableCell content={row.companyName || row.customerFullName || '-'} textAlign='left' />
      )
    },
    {
      key: 'phone',
      width: 140,
      title: () => <FISTableHeaderCell label='SỐ ĐIỆN THOẠI' hasRightDivider />,
      render: (_: unknown, row: DriverItemI) => (
        <FISTableCell content={row.userPhone || row.phone || '-'} textAlign='left' />
      )
    },
    {
      key: 'status',
      width: 140,
      title: () => <FISTableHeaderCell label='TRẠNG THÁI' hasRightDivider />,
      render: (_: unknown, row: DriverItemI) => {
        const normalizedStatus = row.status ?? (row.userStatus ? 'ACTIVE' : 'INACTIVE')
        const badge = STATUS_BADGE[normalizedStatus]
        return badge ? (
          <FISTableCell content={<FISBadge label={badge.label} size='sm' status={badge.status} />} textAlign='left' />
        ) : (
          <FISTableCell content={STATUS_LABELS[normalizedStatus] ?? '-'} textAlign='left' />
        )
      }
    },
    {
      key: 'createdAt',
      width: 120,
      title: () => <FISTableHeaderCell label='NGÀY TẠO' hasRightDivider />,
      render: (_: unknown, row: DriverItemI) => <FISTableCell content={formatDate(row.createdAt)} textAlign='left' />
    },
    {
      key: 'actions',
      className: 'none-border-right',
      width: 150,
      title: () => <FISTableHeaderCell label='THAO TÁC' />,
      render: (_: unknown, row: DriverItemI) => (
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
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  ),
                  onClick: () => navigate(buildTransportationDriverManagementEditPath(row.id))
                },
                // {
                //   label: '',
                //   startIcon: (
                //     <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                //       <path
                //         strokeLinecap='round'
                //         strokeLinejoin='round'
                //         strokeWidth={2}
                //         d='M8 7V3m8 4V3m-9 8h10m-7 4h4m-9 5h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z'
                //       />
                //     </svg>
                //   ),
                //   onClick: () => navigate(buildTransportationDriverManagementAssignVehiclePath(row.id))
                // },
                {
                  label: '',
                  startIcon: (
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
                  ),
                  onClick: () => navigate(buildTransportationDriverManagementDetailPath(row.id))
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
    { label: 'Quản lý tài xế' }
  ]

  return (
    <PageWrapper className='py-5' title='Quản lý tài xế' breadcrumbItems={breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          control={tableToolbar.control}
          handleSearchChange={tableToolbar.handleSearchChange}
          handleSaveFilter={tableToolbar.handleSaveFilter}
          handleResetFilter={tableToolbar.handleResetFilter}
          loadSavedFilterValues={tableToolbar.loadSavedFilterValues}
          filterContent={<DriverManagementFilter control={tableToolbar.control} />}
          filterTitle='Bộ lọc tài xế'
          search={tableToolbar.search}
          filters={tableToolbar.filters}
          searchPlaceholder='Tìm theo tên, số điện thoại'
          actionButtons={
            <FISButton
              type='button'
              startIcon={<AddIcon />}
              onClick={() => navigate(ROUTES.transportationDriverManagementCreate)}
            >
              Thêm mới
            </FISButton>
          }
        />

        <FISTable
          dataSource={dataSource}
          columns={columns}
          rowKey='id'
          scroll={{ y: 'calc(100vh - 320px)' }}
          loading={isListLoading || isListFetching}
        />

        <div>
          <FISPagination
            current={page}
            pageSize={pageSize}
            total={total}
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

export default DriverManagementPage

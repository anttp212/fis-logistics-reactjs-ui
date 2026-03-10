import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTableToolbar } from '@hooks/useTableToolbar'
import {
  ROUTES,
  buildTransportationLogisticInformationDetailPath,
  buildTransportationLogisticInformationEditPath
} from '@constants'
import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton, FISButtonGroup, FISPagination, FISTable, FISTableCell, FISTableHeaderCell } from 'fis-component'
import {
  CUSTOMER_TYPE_LABELS,
  PAYMENT_LABELS,
  formatDisplayDate,
  getLogisticDisplayName,
  type LogisticInformationI
} from './data'
import LogisticInformationFilter from './components/LogisticInformationFilter'
import { useGetLogisticListQuery } from './logisticInformation.api'

interface LogisticFilterValuesI {
  phone: string
  customerType: string
  taxCode: string
}

const LogisticInformationPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const tableToolbar = useTableToolbar<{ phone: string; customerType: string; taxCode: string }, LogisticFilterValuesI>(
    {
      defaultFilterValues: {
        phone: '',
        customerType: '',
        taxCode: ''
      }
    }
  )
  const search = tableToolbar.search
  const phone = tableToolbar.filters?.phone || ''
  const customerType = tableToolbar.filters?.customerType || ''
  const taxCode = tableToolbar.filters?.taxCode || ''

  const listParams = useMemo(
    () => ({
      page,
      size: pageSize,
      search: search.trim() || undefined,
      phone: phone.trim() || undefined,
      customerType: customerType.trim() || undefined,
      taxCode: taxCode.trim() || undefined
    }),
    [page, pageSize, search, phone, customerType, taxCode]
  )
  const { data: listResponse, isLoading } = useGetLogisticListQuery(listParams)

  useEffect(() => {
    setPage(1)
  }, [customerType, phone, search, taxCode])

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
      render: (_: unknown, row: LogisticInformationI & { _index: number }) => (
        <FISTableCell content={String(row._index)} textAlign='left' />
      )
    },
    {
      key: 'name',
      width: 220,
      title: () => <FISTableHeaderCell label='TÊN ĐƠN VỊ' hasRightDivider />,
      render: (_: unknown, row: LogisticInformationI) => (
        <FISTableCell content={getLogisticDisplayName(row)} textAlign='left' />
      )
    },
    {
      key: 'taxCode',
      width: 150,
      title: () => <FISTableHeaderCell label='MÃ SỐ THUẾ' hasRightDivider />,
      render: (_: unknown, row: LogisticInformationI) => <FISTableCell content={row.taxCode || '-'} textAlign='left' />
    },
    {
      key: 'payment',
      width: 140,
      title: () => <FISTableHeaderCell label='THANH TOÁN' hasRightDivider />,
      render: (_: unknown, row: LogisticInformationI) => (
        <FISTableCell content={PAYMENT_LABELS[row.paymentType]} textAlign='left' />
      )
    },
    {
      key: 'subject',
      width: 140,
      title: () => <FISTableHeaderCell label='ĐỐI TƯỢNG' hasRightDivider />,
      render: (_: unknown, row: LogisticInformationI) => (
        <FISTableCell content={CUSTOMER_TYPE_LABELS[row.customerType]} textAlign='left' />
      )
    },
    {
      key: 'createdAt',
      width: 130,
      title: () => <FISTableHeaderCell label='NGÀY TẠO' hasRightDivider />,
      render: (_: unknown, row: LogisticInformationI) => (
        <FISTableCell content={formatDisplayDate(row.createdAt)} textAlign='left' />
      )
    },
    {
      key: 'actions',
      width: 120,
      title: () => <FISTableHeaderCell label='THAO TÁC' />,
      className: 'none-border-right',
      render: (_: unknown, row: LogisticInformationI) => (
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
                  onClick: () => navigate(buildTransportationLogisticInformationDetailPath(row.id))
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
                  onClick: () => navigate(buildTransportationLogisticInformationEditPath(row.id))
                }
              ]}
            />
          }
        />
      )
    }
  ]

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin logistic' }
  ]

  return (
    <PageWrapper className='py-5' title='Quản lý thông tin logistic' breadcrumbItems={breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          control={tableToolbar.control}
          handleSearchChange={tableToolbar.handleSearchChange}
          handleSaveFilter={tableToolbar.handleSaveFilter}
          handleResetFilter={tableToolbar.handleResetFilter}
          loadSavedFilterValues={tableToolbar.loadSavedFilterValues}
          filterContent={<LogisticInformationFilter control={tableToolbar.control} />}
          filterTitle='Bộ lọc logistics'
          search={tableToolbar.search}
          filters={tableToolbar.filters}
          searchPlaceholder='Tìm theo tên'
          actionButtons={
            <FISButton
              type='button'
              startIcon={<AddIcon />}
              onClick={() => navigate(ROUTES.transportationLogisticInformationCreate)}
            >
              Thêm mới
            </FISButton>
          }
        />

        {isLoading ? (
          <div className='flex-1 flex items-center justify-center text-gray-500'>Đang tải dữ liệu...</div>
        ) : (
          <FISTable
            dataSource={dataSource}
            columns={columns}
            rowKey='id'
            scroll={{ y: 'calc(100vh - 320px)' }}
            loading={isLoading}
          />
        )}

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

export default LogisticInformationPage

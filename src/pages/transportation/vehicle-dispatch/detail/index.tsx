import { useParams, useNavigate } from 'react-router-dom'
import { Modal, message } from 'antd'
import { PageWrapper } from '@components'
import { FISTable, FISTableCell, FISTableHeaderCell, FISButton, FISInputArea, FISBadge } from 'fis-component'
import { ROUTES, buildVehicleDispatchEditPath } from '@constants'
import { useGetVehicleDispatchDetailQuery, useCancelVehicleDispatchMutation } from '../vehicleDispatch.api'
import type { DispatchOrderContainerI } from '../vehicleDispatch.api'
import {
  useGetVehicleTypesQuery,
  useGetRequestingUnitsQuery,
  useGetContainerSizesQuery
} from '../vehicleDispatchMaster.api'
import { useMemo, useState, type ReactNode } from 'react'
import { STATUS_BADGE } from '../constants/status'

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

const VehicleDispatchDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: order, isLoading, error } = useGetVehicleDispatchDetailQuery(id!, { skip: !id })
  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: requestingUnits = [] } = useGetRequestingUnitsQuery()
  const { data: containerSizes = [] } = useGetContainerSizesQuery()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelVehicleDispatchMutation()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')

  const vehicleTypeLabels = useMemo(() => toIdNameMap(vehicleTypes), [vehicleTypes])
  const requestingUnitLabels = useMemo(() => toIdNameMap(requestingUnits), [requestingUnits])
  const sizeLabels = useMemo(
    () => Object.fromEntries((containerSizes ?? []).map((s) => [s.id, s.name || s.code])),
    [containerSizes]
  )

  const handleEdit = () => {
    if (order) {
      navigate(buildVehicleDispatchEditPath(order.id))
    }
  }

  const handleCancelClick = () => {
    if (!order) return
    setCancellationReason('')
    setCancelModalOpen(true)
  }

  const handleCancelModalClose = () => {
    setCancelModalOpen(false)
    setCancellationReason('')
  }

  const handleCancelConfirm = async () => {
    if (!order) return
    const reason = cancellationReason.trim()
    if (!reason) {
      message.error('Vui lòng nhập lý do hủy')
      return
    }
    try {
      await cancelOrder({ id: order.id, cancellationReason: reason }).unwrap()
      message.success('Hủy phiếu yêu cầu thành công')
      handleCancelModalClose()
      navigate(ROUTES.transportationVehicleDispatch)
    } catch (err: any) {
      const errorMessage = err?.data?.message
      message.error(errorMessage || 'Hủy phiếu yêu cầu thất bại. Vui lòng thử lại.')
      throw err
    }
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: 'Chi tiết điều xe' }
  ]

  const containerColumns = [
    {
      key: 'index',
      width: 50,
      title: () => <FISTableHeaderCell label='STT' hasRightDivider />,
      render: (_: unknown, _row: DispatchOrderContainerI, index: number) => (
        <FISTableCell content={String(index + 1)} textAlign='left' />
      )
    },
    {
      dataIndex: 'containerNumber',
      key: 'containerNumber',
      width: 140,
      title: () => <FISTableHeaderCell label='SỐ CONTAINER' hasRightDivider />,
      render: (_: unknown, row: DispatchOrderContainerI) => (
        <FISTableCell content={row.containerNumber ?? row.containerNo ?? '-'} textAlign='left' />
      )
    },
    {
      dataIndex: 'size',
      key: 'size',
      width: 100,
      title: () => <FISTableHeaderCell label='KÍCH THƯỚC' hasRightDivider />,
      render: (_: unknown, row: DispatchOrderContainerI) => (
        <FISTableCell
          content={sizeLabels[row.size ?? row.containerSizeId ?? ''] ?? row.size ?? row.containerSizeId ?? '-'}
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      title: () => <FISTableHeaderCell label='TRỌNG LƯỢNG' hasRightDivider />,
      render: (_: unknown, row: DispatchOrderContainerI) => (
        <FISTableCell content={String(row.weight ?? row.containerWeight ?? '-')} textAlign='left' />
      )
    },
    {
      dataIndex: 'driver',
      key: 'driver',
      width: 140,
      title: () => <FISTableHeaderCell label='TÀI XẾ' hasRightDivider />,
      render: (_: unknown, row: DispatchOrderContainerI) => (
        <FISTableCell
          content={String(row.driverName + ' - ' + row.driverPhone + ' - ' + row.driverPlateNo)}
          textAlign='left'
        />
      )
    }
  ]

  return (
    <PageWrapper
      className='overflow-y-auto mt-6 pb-6'
      title='Chi tiết điều xe'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      onBackClick={() => navigate(ROUTES.transportationVehicleDispatch)}
      actionButtons={
        order?.status === 'PENDING_CONFIRMATION' ? (
          <div className='flex gap-2'>
            <FISButton variant='tertiary' onClick={handleEdit}>
              Chỉnh sửa
            </FISButton>
            <FISButton variant='secondary-negative' onClick={handleCancelClick}>
              Hủy
            </FISButton>
          </div>
        ) : null
      }
    >
      <Modal
        title='Xác nhận hủy'
        open={cancelModalOpen}
        onCancel={handleCancelModalClose}
        onOk={handleCancelConfirm}
        okText='Lưu'
        cancelText='Đóng'
        centered
        width={900}
        confirmLoading={isCancelling}
      >
        <div className='pt-2'>
          <FISInputArea
            textLabel='Lý do hủy'
            placeholder='Nhập lý do hủy'
            rows={4}
            value={cancellationReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setCancellationReason(e?.target?.value ?? '')
            }}
            minLength={10}
            maxLength={2000}
          />
        </div>
      </Modal>
      <div className='flex flex-col gap-6'>
        {isLoading && (
          <div className=' flex items-center justify-center py-12'>
            <div className='text-gray-500'>Đang tải thông tin...</div>
          </div>
        )}

        {error && (
          <div className=' bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-sm text-red-800'>Không tìm thấy thông tin lệnh điều xe</p>
          </div>
        )}

        {order && !isLoading && (
          <>
            {/* Thông tin chung */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin chung</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <InfoItem label='Mã điều xe' value={order.dispatchCode ?? '-'} />
                <InfoItem
                  label='Loại xe'
                  value={
                    vehicleTypeLabels[order.vehicleType ?? order.vehicleTypeId ?? ''] ??
                    order.vehicleType ??
                    order.vehicleTypeId
                  }
                />
                <InfoItem
                  label='Đơn vị yêu cầu'
                  value={
                    requestingUnitLabels[order.requestUnit ?? order.requestingUnitId ?? ''] ??
                    order.requestUnit ??
                    order.requestingUnitId
                  }
                />
                <InfoItem label='Điểm đi' value={order.departureLocationName ?? '-'} />
                <InfoItem label='Điểm đến' value={order.destinationLocationName ?? '-'} />
                <InfoItem
                  label='Thời gian dự kiến nhận hàng (ở điểm đi)'
                  value={formatDateTime(order.expectedPickupTime ?? order.estimatedPickupTime)}
                />
                <InfoItem
                  label='Thời gian dự kiến giao hàng (ở điểm đến)'
                  value={formatDateTime(order.expectedDeliveryTime ?? order.estimatedDeliveryTime)}
                />
                <InfoItem label='Nội dung' value={order.content} />
                <InfoItem label='Tên người nhận' value={order.recipientName ?? '-'} />
                <InfoItem label='Số điện thoại' value={order.recipientPhone ?? '-'} />
                <InfoItem
                  label='Trạng thái'
                  value={
                    <FISBadge
                      label={STATUS_BADGE[order.status ?? '']?.label ?? order.status ?? '-'}
                      size='sm'
                      status={STATUS_BADGE[order.status ?? '']?.status ?? 'info'}
                    />
                  }
                />
              </div>
            </div>

            {/* Thông tin chi tiết container */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin chi tiết container</h3>
              <FISTable
                dataSource={order.containers ?? []}
                columns={containerColumns}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowKey={(_, i) => String(i)}
              />
            </div>

            {/* Ghi chú */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Ghi chú</h3>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>{order.note ?? order.notes ?? '-'}</p>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  )
}

const InfoItem = ({
  label,
  value,
  className = ''
}: {
  label: string
  value?: ReactNode | null
  className?: string
}) => (
  <div className={className}>
    <label className='block text-sm font-medium text-gray-500 mb-1'>{label}</label>
    <p className='text-sm text-gray-900'>{value ?? '-'}</p>
  </div>
)

export default VehicleDispatchDetail

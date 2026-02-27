import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@components'
import { FISTable, FISTableCell, FISTableHeaderCell, FISButton, FISButtonGroup } from 'fis-component'
import { ROUTES } from '@constants'
import { BackIcon } from '@images'
import ShipmentDetailModal from '../components/ShipmentDetailModal'
import AssignDriverModal from '../components/AssignDriverModal'
import {
  useGetVehicleDispatchDetailQuery,
  useGetDriversQuery,
  useAssignDriverMutation,
  useUpdateShipmentDetailMutation,
  useDeleteVehicleDispatchMutation
} from '../vehicleDispatch.api'
import type { ShipmentDetailI } from '../vehicleDispatch.api'

const VehicleDispatchDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false)
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetailI | null>(null)
  const [assignOrderKey, setAssignOrderKey] = useState<string>('')

  const { data: order, isLoading, error } = useGetVehicleDispatchDetailQuery(id!, { skip: !id })
  const { data: drivers } = useGetDriversQuery()
  const [assignDriver] = useAssignDriverMutation()
  const [updateShipmentDetail] = useUpdateShipmentDetailMutation()
  const [deleteOrder] = useDeleteVehicleDispatchMutation()

  const driversList = drivers ?? []

  const handleAssignDriverClick = (orderKey: string, shipment: ShipmentDetailI) => {
    setAssignOrderKey(orderKey)
    setSelectedShipment(shipment)
    setAssignDriverModalOpen(true)
  }

  const handleAssignDriverConfirm = async (orderKey: string, shipmentKey: string, driverId: string) => {
    await assignDriver({ orderKey, shipmentDetailKey: shipmentKey, driverId })
    setAssignDriverModalOpen(false)
    setSelectedShipment(null)
    setAssignOrderKey('')
  }

  const handleSaveShipment = async (orderKey: string, shipmentKey: string, data: Partial<ShipmentDetailI>) => {
    await updateShipmentDetail({ orderKey, shipmentKey, data })
  }

  const handleConfirmShipment = (_orderKey: string, _shipmentKey: string) => {
    // TODO: Call API xác nhận shipment
  }

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
  }

  const handleDelete = () => {
    if (!order) return
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa lệnh điều xe này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{order.billBooking}</p>
          <p className='mt-1 text-sm text-gray-500'>Lô hàng: {order.lotId}</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteOrder(order.key)
        navigate(ROUTES.transportationVehicleDispatch)
      }
    })
  }

  const handleBillBookingClick = () => {
    setShipmentModalOpen(true)
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: 'Chi tiết điều xe' }
  ]

  const shipmentColumns = [
    {
      dataIndex: 'status',
      key: 'status',
      width: 120,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => <FISTableCell content={row.status} textAlign='left' />
    },
    {
      dataIndex: 'containerNo',
      key: 'containerNo',
      width: 120,
      title: () => <FISTableHeaderCell label='Container No' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => <FISTableCell content={row.containerNo} textAlign='left' />
    },
    {
      dataIndex: 'size',
      key: 'size',
      width: 80,
      title: () => <FISTableHeaderCell label='Kích thước' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => <FISTableCell content={row.size} textAlign='left' />
    },
    {
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      title: () => <FISTableHeaderCell label='Trọng lượng' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => <FISTableCell content={row.weight} textAlign='left' />
    },
    {
      dataIndex: 'assignedDriver',
      key: 'assignedDriver',
      width: 140,
      title: () => <FISTableHeaderCell label='Chỉ định' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) =>
        order ? (
          <FISTableCell
            content={
              <button
                type='button'
                onClick={() => handleAssignDriverClick(order.key, row)}
                className={`text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer ${
                  row.assignedDriver ? 'text-green-600' : ''
                }`}
              >
                {row.assignedDriver || 'Chỉ định tài xế'}
              </button>
            }
            textAlign='left'
          />
        ) : null
    },
    {
      dataIndex: 'yardCoordinates',
      key: 'yardCoordinates',
      width: 100,
      title: () => <FISTableHeaderCell label='Tọa độ bãi' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => (
        <FISTableCell content={row.yardCoordinates || '—'} textAlign='left' />
      )
    },
    {
      dataIndex: 'dispatchNote',
      key: 'dispatchNote',
      width: 150,
      title: () => <FISTableHeaderCell label='Ghi chú điều vận' hasRightDivider />,
      render: (_: unknown, row: ShipmentDetailI) => <FISTableCell content={row.dispatchNote || '—'} textAlign='left' />
    },
    {
      title: () => <FISTableHeaderCell label='Thao tác' />,
      key: 'actions',
      width: 140,
      render: (_: unknown, row: ShipmentDetailI) =>
        order ? (
          <FISTableCell
            style={{ textAlign: 'center' }}
            icon={
              <FISButtonGroup
                size='md'
                options={[
                  { label: 'Lưu', startIcon: null, onClick: () => handleSaveShipment(order.key, row.key, {}) },
                  {
                    label: 'Xác nhận',
                    startIcon: null,
                    onClick: () => handleConfirmShipment(order.key, row.key)
                  }
                ]}
              />
            }
          />
        ) : null
    }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết điều xe'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      onBackClick={() => navigate(ROUTES.transportationVehicleDispatch)}
      actionButtons={
        <div className='flex gap-2'>
          <FISButton variant='tertiary' onClick={handleEdit}>
            Chỉnh sửa
          </FISButton>
          <FISButton variant='secondary-negative' onClick={handleDelete}>
            Xóa
          </FISButton>
          <FISButton
            variant='tertiary'
            startIcon={<BackIcon />}
            onClick={() => navigate(ROUTES.transportationVehicleDispatch)}
          >
            Quay lại
          </FISButton>
        </div>
      }
    >
      <div className='flex flex-col gap-6'>
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-gray-500'>Đang tải thông tin...</div>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-sm text-red-800'>Không tìm thấy thông tin lệnh điều xe</p>
          </div>
        )}

        {order && !isLoading && (
          <>
            {/* Thông tin cơ bản */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin lệnh điều xe</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>ID lô hàng</label>
                  <p className='text-sm text-gray-900'>{order.lotId}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>Bill/Booking</label>
                  <button
                    type='button'
                    onClick={handleBillBookingClick}
                    className='text-blue-600 hover:text-blue-800 hover:underline font-medium text-left'
                  >
                    {order.billBooking}
                  </button>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>Chủ hàng</label>
                  <p className='text-sm text-gray-900'>{order.owner}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>Số lượng</label>
                  <p className='text-sm text-gray-900'>{order.quantity}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>Thời gian</label>
                  <p className='text-sm text-gray-900'>{order.time}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>OPR</label>
                  <p className='text-sm text-gray-900'>{order.opr}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-1'>Người tạo lệnh</label>
                  <p className='text-sm text-gray-900'>{order.createdBy}</p>
                </div>
              </div>
            </div>

            {/* Chi tiết lô hàng */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Chi tiết lô hàng</h3>
              <FISTable
                dataSource={order.shipmentDetails || []}
                columns={shipmentColumns}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
            </div>
          </>
        )}
      </div>

      <ShipmentDetailModal
        open={shipmentModalOpen}
        onClose={() => setShipmentModalOpen(false)}
        order={order || null}
        onSave={handleSaveShipment}
        onConfirm={handleConfirmShipment}
        onAssignDriver={handleAssignDriverClick}
      />

      <AssignDriverModal
        open={assignDriverModalOpen}
        onClose={() => {
          setAssignDriverModalOpen(false)
          setSelectedShipment(null)
          setAssignOrderKey('')
        }}
        drivers={driversList}
        shipment={selectedShipment}
        orderKey={assignOrderKey}
        onConfirm={handleAssignDriverConfirm}
      />
    </PageWrapper>
  )
}

export default VehicleDispatchDetail

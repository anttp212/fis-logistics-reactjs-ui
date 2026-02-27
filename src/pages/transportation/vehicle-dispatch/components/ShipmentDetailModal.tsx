import { Modal } from 'antd'
import { FISTable, FISTableCell, FISTableHeaderCell, FISButtonGroup } from 'fis-component'
import type { ShipmentDetailI, VehicleDispatchOrderI } from '../vehicleDispatch.api'

interface ShipmentDetailModalPropsI {
  open: boolean
  onClose: () => void
  order: VehicleDispatchOrderI | null
  onSave: (orderKey: string, shipmentKey: string, data: Partial<ShipmentDetailI>) => void
  onConfirm: (orderKey: string, shipmentKey: string) => void
  onAssignDriver: (orderKey: string, shipment: ShipmentDetailI) => void
}

const ShipmentDetailModal = ({
  open,
  onClose,
  order,
  onSave,
  onConfirm,
  onAssignDriver
}: ShipmentDetailModalPropsI) => {
  if (!order) return null

  const columns = [
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
      render: (_: unknown, row: ShipmentDetailI) => (
        <FISTableCell
          content={
            <button
              type='button'
              onClick={() => onAssignDriver(order.key, row)}
              className={`text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer ${
                row.assignedDriver ? 'text-green-600' : ''
              }`}
            >
              {row.assignedDriver || 'Chỉ định tài xế'}
            </button>
          }
          textAlign='left'
        />
      )
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
      render: (_: unknown, row: ShipmentDetailI) => (
        <FISTableCell
          style={{ textAlign: 'center' }}
          icon={
            <FISButtonGroup
              size='md'
              options={[
                {
                  label: 'Lưu',
                  startIcon: null,
                  onClick: () => onSave(order.key, row.key, {})
                },
                {
                  label: 'Xác nhận',
                  startIcon: null,
                  onClick: () => onConfirm(order.key, row.key)
                }
              ]}
            />
          }
        />
      )
    }
  ]

  return (
    <Modal
      title={`Chi tiết lô hàng - ${order.billBooking}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <div className='mt-4'>
        <FISTable
          dataSource={order.shipmentDetails || []}
          columns={columns}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </div>
    </Modal>
  )
}

export default ShipmentDetailModal

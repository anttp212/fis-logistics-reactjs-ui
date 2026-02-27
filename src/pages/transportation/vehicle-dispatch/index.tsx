import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, buildVehicleDispatchDetailPath } from '@constants'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import VehicleDispatchFilter from './components/VehicleDispatchFilter'
import ShipmentDetailModal from './components/ShipmentDetailModal'
import AssignDriverModal from './components/AssignDriverModal'
import { useVehicleDispatch } from './useVehicleDispatch'
import {
  useGetVehicleDispatchListQuery,
  useGetDriversQuery,
  useAssignDriverMutation,
  useUpdateShipmentDetailMutation,
  useDeleteVehicleDispatchMutation
} from './vehicleDispatch.api'
import type { VehicleDispatchOrderI, ShipmentDetailI } from './vehicleDispatch.api'

interface TableRowSelectionI {
  selectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[]) => void
  renderCell?: (checked: boolean, record: VehicleDispatchOrderI) => React.ReactNode
  columnTitle?: React.ReactNode
}

interface CheckboxPropsI {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ checked = false, indeterminate = false, onChange }: CheckboxPropsI) => (
  <input
    type='checkbox'
    checked={checked}
    ref={(input) => {
      if (input) input.indeterminate = indeterminate
    }}
    onChange={onChange}
    className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
  />
)

const VehicleDispatchPage = () => {
  const navigate = useNavigate()
  const vehicleDispatch = useVehicleDispatch()
  const filterValues = vehicleDispatch.watch() as Record<string, string>

  const { data: listResponse } = useGetVehicleDispatchListQuery()
  const { data: driversResponse } = useGetDriversQuery()
  const [assignDriver] = useAssignDriverMutation()
  const [updateShipmentDetail] = useUpdateShipmentDetailMutation()
  const [deleteOrder] = useDeleteVehicleDispatchMutation()

  const [shipmentModalOpen, setShipmentModalOpen] = useState(false)
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<VehicleDispatchOrderI | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetailI | null>(null)
  const [assignOrderKey, setAssignOrderKey] = useState<string>('')

  // API trả về trực tiếp: listResponse = { data: orders[], total }, driversResponse = drivers[]
  const drivers: import('./vehicleDispatch.api').DriverI[] = driversResponse ?? []

  const dataSource = useMemo(() => {
    const orders: VehicleDispatchOrderI[] = listResponse?.data ?? []
    let filtered = [...orders]
    if (filterValues?.billBooking) {
      filtered = filtered.filter((o) =>
        o.billBooking.toLowerCase().includes(String(filterValues.billBooking).toLowerCase())
      )
    }
    if (filterValues?.owner) {
      filtered = filtered.filter((o) => o.owner.toLowerCase().includes(String(filterValues.owner).toLowerCase()))
    }
    if (filterValues?.opr) {
      filtered = filtered.filter((o) => o.opr.toLowerCase().includes(String(filterValues.opr).toLowerCase()))
    }
    if (vehicleDispatch.search) {
      const s = vehicleDispatch.search.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.billBooking.toLowerCase().includes(s) ||
          o.owner.toLowerCase().includes(s) ||
          o.lotId.toLowerCase().includes(s)
      )
    }
    return filtered
  }, [listResponse?.data, filterValues, vehicleDispatch.search])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const isAllSelected = selectedRowKeys.length === dataSource.length && dataSource.length > 0
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length

  const handleSelect = (key: React.Key) => {
    setSelectedRowKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }
  const toggleSelectAll = () => {
    setSelectedRowKeys(isAllSelected ? [] : dataSource.map((o) => o.key))
  }

  const rowSelection: TableRowSelectionI = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    renderCell: (checked, record) => (
      <FISTableCell icon={<Checkbox checked={checked} onChange={() => handleSelect(record.key)} />} hasBorder={false} />
    ),
    columnTitle: (
      <FISTableHeaderCell
        label=''
        rightComponent={<Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={toggleSelectAll} />}
        hasRightDivider={false}
      />
    )
  }

  const handleViewDetail = (record: VehicleDispatchOrderI) => {
    navigate(buildVehicleDispatchDetailPath(record.key))
  }

  const handleEdit = (record: VehicleDispatchOrderI) => {
    navigate(buildVehicleDispatchDetailPath(record.key))
  }

  const handleDelete = (record: VehicleDispatchOrderI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa lệnh điều xe này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.billBooking}</p>
          <p className='mt-1 text-sm text-gray-500'>Lô hàng: {record.lotId}</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteOrder(record.key)
      }
    })
  }

  const handleBillBookingClick = (record: VehicleDispatchOrderI) => {
    setSelectedOrder(record)
    setShipmentModalOpen(true)
  }

  const handleAssignDriverClick = (orderKey: string, shipment: ShipmentDetailI) => {
    setAssignOrderKey(orderKey)
    setSelectedShipment(shipment)
    setAssignDriverModalOpen(true)
  }

  const handleAssignDriverConfirm = async (orderKey: string, shipmentKey: string, driverId: string) => {
    await assignDriver({ orderKey, shipmentDetailKey: shipmentKey, driverId })
    const driver = drivers.find((d) => d.id === driverId)
    if (driver) {
      setSelectedOrder((prev) => {
        if (!prev || prev.key !== orderKey) return prev
        const updatedDetails = prev.shipmentDetails?.map((s) =>
          s.key === shipmentKey
            ? {
                ...s,
                assignedDriver: driver.name,
                assignedDriverPhones: [driver.phone],
                status: 'Đã chỉ định'
              }
            : s
        )
        return { ...prev, shipmentDetails: updatedDetails }
      })
    }
  }

  const handleSaveShipment = async (orderKey: string, shipmentKey: string, data: Partial<ShipmentDetailI>) => {
    await updateShipmentDetail({ orderKey, shipmentKey, data })
  }

  const handleConfirmShipment = (_orderKey: string, _shipmentKey: string) => {
    // TODO: Call API xác nhận shipment
  }

  const columns = [
    {
      dataIndex: 'lotId',
      key: 'lotId',
      width: 120,
      title: () => <FISTableHeaderCell label='ID lô hàng' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => <FISTableCell content={row.lotId} textAlign='left' />
    },
    {
      dataIndex: 'billBooking',
      key: 'billBooking',
      width: 140,
      title: () => <FISTableHeaderCell label='Bill/Booking' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => (
        <FISTableCell
          content={
            <button
              type='button'
              onClick={() => handleBillBookingClick(row)}
              className='text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer text-left'
            >
              {row.billBooking}
            </button>
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'owner',
      key: 'owner',
      width: 180,
      title: () => <FISTableHeaderCell label='CHỦ HÀNG' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => <FISTableCell content={row.owner} textAlign='left' />
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      title: () => <FISTableHeaderCell label='SỐ LƯỢNG' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => (
        <FISTableCell content={String(row.quantity)} textAlign='left' />
      )
    },
    {
      dataIndex: 'time',
      key: 'time',
      width: 150,
      title: () => <FISTableHeaderCell label='THỜI GIAN' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => <FISTableCell content={row.time} textAlign='left' />
    },
    {
      dataIndex: 'opr',
      key: 'opr',
      width: 100,
      title: () => <FISTableHeaderCell label='OPR' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => <FISTableCell content={row.opr} textAlign='left' />
    },
    {
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      title: () => <FISTableHeaderCell label='NGƯỜI TẠO LỆNH' hasRightDivider />,
      render: (_: unknown, row: VehicleDispatchOrderI) => <FISTableCell content={row.createdBy} textAlign='left' />
    },
    {
      title: () => <FISTableHeaderCell label='THAO TÁC' />,
      key: 'actions',
      width: 140,
      render: (_: unknown, record: VehicleDispatchOrderI) => (
        <FISTableCell
          style={{ textAlign: 'center' }}
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
                },
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
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      }
                      variant='secondary-invisible-negative'
                      onClick={() => handleDelete(record)}
                    />
                  )
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
    { label: 'Điều xe' }
  ]

  return (
    <PageWrapper className='p-5' title='Điều xe' breadcrumbItems={breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          filterContent={<VehicleDispatchFilter control={vehicleDispatch.control} />}
          {...vehicleDispatch}
          searchPlaceholder='Tìm kiếm Bill/Booking, chủ hàng...'
        />

        <div className='flex-1 bg-white rounded-lg overflow-hidden p-4'>
          <FISTable
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <ShipmentDetailModal
        open={shipmentModalOpen}
        onClose={() => {
          setShipmentModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
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
        drivers={drivers}
        shipment={selectedShipment}
        orderKey={assignOrderKey}
        onConfirm={handleAssignDriverConfirm}
      />
    </PageWrapper>
  )
}

export default VehicleDispatchPage

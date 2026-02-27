import { Modal } from 'antd'
import { FISButton, FISSelect } from 'fis-component'
import { Controller, useForm } from 'react-hook-form'
import type { DriverI, ShipmentDetailI } from '../vehicleDispatch.api'

interface AssignDriverModalPropsI {
  open: boolean
  onClose: () => void
  drivers: DriverI[]
  shipment: ShipmentDetailI | null
  orderKey: string
  onConfirm: (orderKey: string, shipmentKey: string, driverId: string) => void
}

interface FormValuesI {
  driverId: string
}

const AssignDriverModal = ({ open, onClose, drivers, shipment, orderKey, onConfirm }: AssignDriverModalPropsI) => {
  const { control, handleSubmit, watch, reset } = useForm<FormValuesI>({
    defaultValues: { driverId: '' }
  })

  const selectedDriverId = watch('driverId')
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId)

  const driverOptions = [
    {
      items: drivers.map((d) => ({ label: d.name, value: d.id }))
    }
  ]

  const handleConfirm = handleSubmit((data) => {
    if (data.driverId && shipment) {
      onConfirm(orderKey, shipment.key, data.driverId)
      reset()
      onClose()
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!shipment) return null

  return (
    <Modal
      title='Chỉ định tài xế'
      open={open}
      onCancel={handleClose}
      footer={
        <div className='flex justify-end gap-2'>
          <FISButton variant='secondary' onClick={handleClose}>
            Hủy
          </FISButton>
          <FISButton variant='primary' onClick={handleConfirm}>
            Xác nhận
          </FISButton>
        </div>
      }
      width={450}
      destroyOnClose
    >
      <form onSubmit={handleConfirm} className='mt-4 space-y-4'>
        <div>
          <Controller
            name='driverId'
            control={control}
            rules={{ required: 'Vui lòng chọn tài xế' }}
            render={({ field }) => (
              <FISSelect {...field} textLabel='Danh sách tài xế' placeholder='Chọn tài xế' options={driverOptions} />
            )}
          />
        </div>

        {selectedDriver && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Số điện thoại tài xế</label>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='font-medium text-gray-900'>{selectedDriver.name}</p>
              <p className='text-sm text-gray-600 mt-1'>{selectedDriver.phone}</p>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default AssignDriverModal

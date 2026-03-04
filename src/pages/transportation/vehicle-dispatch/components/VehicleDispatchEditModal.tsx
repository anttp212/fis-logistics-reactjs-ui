import { Modal } from 'antd'
import VehicleDispatchEditForm from './VehicleDispatchEditForm'

interface VehicleDispatchEditModalPropsI {
  open: boolean
  orderId: string | null
  onClose: () => void
}

const VehicleDispatchEditModal = ({ open, orderId, onClose }: VehicleDispatchEditModalPropsI) => {
  const handleSuccess = () => {
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title='Chỉnh sửa điều xe'
      footer={null}
      width={900}
    >
      {orderId && (
        <div className='max-h-[70vh] overflow-y-auto pr-2'>
          <VehicleDispatchEditForm
            orderId={orderId}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      )}
    </Modal>
  )
}

export default VehicleDispatchEditModal

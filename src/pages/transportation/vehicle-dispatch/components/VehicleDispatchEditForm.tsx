import VehicleDispatchForm from './VehicleDispatchForm'

interface VehicleDispatchEditFormPropsI {
  orderId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const VehicleDispatchEditForm = ({ orderId, onSuccess, onCancel }: VehicleDispatchEditFormPropsI) => (
  <VehicleDispatchForm mode='edit' orderId={orderId} onSuccess={onSuccess} onCancel={onCancel} />
)

export default VehicleDispatchEditForm

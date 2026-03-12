import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { PageWrapper } from '@components'
import { ROUTES, buildTransportationVehicleFleetEditPath } from '@constants'
import { STATUS_LABELS, VEHICLE_TYPE_LABELS, formatDate } from '../data'
import { useGetVehicleFleetDetailQuery } from '../vehicleFleet.api'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const VehicleFleetDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Chi tiết xe' }
  ]

  const { data: detail } = useGetVehicleFleetDetailQuery(id!, { skip: !id })

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chi tiết xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleFleet)}
      hasBackButton
    >
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='flex justify-between items-start gap-4 mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-slate-800'>{detail?.id || 'Không tìm thấy xe'}</h3>
            <p className='text-sm text-slate-500 mt-1'>{detail ? '' : ''}</p>
          </div>
          {detail && (
            <FISButton variant='primary' onClick={() => navigate(buildTransportationVehicleFleetEditPath(detail.id))}>
              Chỉnh sửa
            </FISButton>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DetailItem label='Logistics' value={detail ? detail?.companyName || detail?.fullName : '-'} />
          <DetailItem label='Trạng thái' value={detail ? STATUS_LABELS[detail.status] : '-'} />
          <DetailItem label='Loại xe' value={detail ? VEHICLE_TYPE_LABELS[detail.vehicleType] : '-'} />
          <DetailItem label='Biển số' value={detail?.licensePlate} />
          <DetailItem label='Biển số phụ' value={detail?.secondaryLicensePlate} />
          <DetailItem label='Tải trọng' value={detail?.payloadCapacity} />
          <DetailItem label='Trọng lượng' value={detail?.weight} />
          <DetailItem label='Hạn đăng kiểm' value={formatDate(detail?.inspectionExpiryDate)} />
          <DetailItem label='Ghi chú' value={detail?.note} />
        </div>
      </div>
    </PageWrapper>
  )
}

export default VehicleFleetDetailPage

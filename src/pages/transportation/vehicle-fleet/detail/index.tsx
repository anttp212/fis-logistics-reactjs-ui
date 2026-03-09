import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { PageWrapper } from '@components'
import { ROUTES, buildTransportationVehicleFleetEditPath } from '@constants'
import { STATUS_LABELS, VEHICLE_TYPE_LABELS, formatDate, getLogisticsLabel, MOCK_FLEET_DATA } from '../data'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const VehicleFleetDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const item = useMemo(() => MOCK_FLEET_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Chi tiết xe' }
  ]

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
            <h3 className='text-lg font-semibold text-slate-800'>{item?.plateNumber || 'Không tìm thấy xe'}</h3>
            <p className='text-sm text-slate-500 mt-1'>{item ? getLogisticsLabel(item.logisticsId) : ''}</p>
          </div>
          {item && (
            <FISButton variant='primary' onClick={() => navigate(buildTransportationVehicleFleetEditPath(item.id))}>
              Chỉnh sửa
            </FISButton>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DetailItem label='Logistics' value={item ? getLogisticsLabel(item.logisticsId) : '-'} />
          <DetailItem label='Trạng thái' value={item ? STATUS_LABELS[item.status] : '-'} />
          <DetailItem label='Loại xe' value={item ? VEHICLE_TYPE_LABELS[item.vehicleType] : '-'} />
          <DetailItem label='Biển số' value={item?.plateNumber} />
          <DetailItem label='Biển số phụ' value={item?.secondaryPlateNumber} />
          <DetailItem label='Tải trọng' value={item?.payload} />
          <DetailItem label='Trọng lượng' value={item?.weight} />
          <DetailItem label='Hạn đăng kiểm' value={formatDate(item?.inspectionExpiry)} />
          <DetailItem label='Ghi chú' value={item?.note} />
        </div>
      </div>
    </PageWrapper>
  )
}

export default VehicleFleetDetailPage

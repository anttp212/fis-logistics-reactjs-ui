import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { PageWrapper } from '@components'
import {
  ROUTES,
  buildTransportationDriverManagementAssignVehiclePath,
  buildTransportationDriverManagementEditPath
} from '@constants'
import { GENDER_LABELS, STATUS_LABELS, formatDate } from '../data'
import { VEHICLE_TYPE_LABELS } from '../../vehicle-fleet/data'
import { useGetDriverDetailQuery } from '../driverManagement.api'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const DriverManagementDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: item, isLoading } = useGetDriverDetailQuery(id!, { skip: !id })

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Chi tiết tài xế' }
  ]

  if (!id) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chi tiết tài xế'
        breadcrumbItems={breadcrumbItems}
        onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
        hasBackButton
      >
        <div className='text-gray-500'>Không tìm thấy tài xế.</div>
      </PageWrapper>
    )
  }

  if (isLoading || !item) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chi tiết tài xế'
        breadcrumbItems={breadcrumbItems}
        onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
        hasBackButton
      >
        <div className='text-gray-500'>Đang tải dữ liệu...</div>
      </PageWrapper>
    )
  }

  const normalizedStatus = item.status ?? (item.userStatus ? 'ACTIVE' : 'INACTIVE')

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chi tiết tài xế'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
      hasBackButton
    >
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='flex justify-between items-start gap-4 mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-slate-800'>{item.userFullName || item.fullName || '-'}</h3>
            <p className='text-sm text-slate-500 mt-1'>{item.username || '-'}</p>
          </div>
          <div className='flex gap-2'>
            <FISButton
              variant='secondary'
              onClick={() => navigate(buildTransportationDriverManagementAssignVehiclePath(item.id))}
            >
              Chỉ định xe
            </FISButton>
            <FISButton variant='primary' onClick={() => navigate(buildTransportationDriverManagementEditPath(item.id))}>
              Chỉnh sửa
            </FISButton>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DetailItem label='Tên cá nhân' value={item.userFullName || item.fullName} />
          <DetailItem label='Tên đăng nhập' value={item.username} />
          <DetailItem label='Logistics' value={item.companyName || item.customerFullName} />
          <DetailItem label='CCCD/CMND' value={item.idCardNumber} />
          <DetailItem label='Số điện thoại' value={item.userPhone || item.phone} />
          <DetailItem label='Email' value={item.userEmail || item.email} />
          <DetailItem label='Giới tính' value={item.gender ? GENDER_LABELS[item.gender] : '-'} />
          <DetailItem label='Trạng thái' value={STATUS_LABELS[normalizedStatus]} />
          <DetailItem
            label='Xe đầu kéo'
            value={
              item.primaryVehicleLicensePlate
                ? `${item.primaryVehicleLicensePlate} (${VEHICLE_TYPE_LABELS[item.primaryVehicleType]})`
                : '-'
            }
          />
          <DetailItem
            label='Xe rơ moóc'
            value={
              item.trailerVehicleLicensePlate
                ? `${item.trailerVehicleLicensePlate} (${VEHICLE_TYPE_LABELS[item.trailerVehicleType]})`
                : '-'
            }
          />
          <DetailItem label='Ngày tạo' value={formatDate(item.createdAt)} />
          <DetailItem label='Ghi chú' value={item.note} />
        </div>
      </div>
    </PageWrapper>
  )
}

export default DriverManagementDetailPage

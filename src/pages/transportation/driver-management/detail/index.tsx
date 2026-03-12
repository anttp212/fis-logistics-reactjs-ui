import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { PageWrapper } from '@components'
import {
  ROUTES,
  buildTransportationDriverManagementAssignVehiclePath,
  buildTransportationDriverManagementEditPath
} from '@constants'
import { GENDER_LABELS, MOCK_DRIVER_DATA, STATUS_LABELS, formatDate } from '../data'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const DriverManagementDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const item = useMemo(() => MOCK_DRIVER_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Chi tiết tài xế' }
  ]

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
            <h3 className='text-lg font-semibold text-slate-800'>{item?.fullName || 'Không tìm thấy tài xế'}</h3>
            <p className='text-sm text-slate-500 mt-1'>{item ? '' : ''}</p>
          </div>
          {item && (
            <div className='flex gap-2'>
              <FISButton
                variant='secondary'
                onClick={() => navigate(buildTransportationDriverManagementAssignVehiclePath(item.id))}
              >
                Chỉ định xe
              </FISButton>
              <FISButton
                variant='primary'
                onClick={() => navigate(buildTransportationDriverManagementEditPath(item.id))}
              >
                Chỉnh sửa
              </FISButton>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DetailItem label='Tên cá nhân' value={item?.fullName} />
          <DetailItem label='Logistics' value={item ? '-' : '-'} />
          <DetailItem label='CCCD/CMND' value={item?.idCardNumber} />
          <DetailItem label='Số điện thoại' value={item?.phone} />
          <DetailItem label='Email' value={item?.email} />
          <DetailItem label='Giới tính' value={item?.gender ? GENDER_LABELS[item.gender] : '-'} />
          <DetailItem label='Trạng thái' value={item ? STATUS_LABELS[item.status] : '-'} />
          <DetailItem label='Ngày tạo' value={formatDate(item?.createdAt)} />
          {/* <DetailItem label='Xe được chỉ định' value={getVehicleLabel(item?.assignedVehicleId)} /> */}
          <DetailItem label='Ghi chú' value={item?.note} />
        </div>
      </div>
    </PageWrapper>
  )
}

export default DriverManagementDetailPage

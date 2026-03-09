import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { ROUTES, buildTransportationLogisticInformationEditPath } from '@constants'
import { PageWrapper } from '@components'
import {
  CUSTOMER_TYPE_LABELS,
  MOCK_LOGISTIC_DATA,
  PAYMENT_LABELS,
  formatDisplayDate,
  getLogisticDisplayName
} from '../data'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const LogisticInformationDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const item = useMemo(() => MOCK_LOGISTIC_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Chi tiet logistic' }
  ]

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chi tiet logistic'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
      hasBackButton
    >
      <div className='space-y-6'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex justify-between items-start gap-4 mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-slate-800'>
                {item ? getLogisticDisplayName(item) : 'Khong tim thay logistic'}
              </h3>
              <p className='text-sm text-slate-500 mt-1'>{item ? item.customerCode || '-' : ''}</p>
            </div>
            {item && (
              <FISButton
                variant='primary'
                onClick={() => navigate(buildTransportationLogisticInformationEditPath(item.id))}
              >
                Chinh sua
              </FISButton>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <DetailItem label='Loai khach hang' value={item ? CUSTOMER_TYPE_LABELS[item.customerType] : '-'} />
            <DetailItem label='Thanh toan' value={item ? PAYMENT_LABELS[item.paymentType] : '-'} />
            <DetailItem label='Ten don vi / Ho va ten' value={item ? getLogisticDisplayName(item) : '-'} />
            <DetailItem label='Ten rut gon' value={item?.shortName} />
            <DetailItem label='Ma so thue' value={item?.taxCode} />
            <DetailItem label='CCCD/CMND' value={item?.identityNumber} />
            <DetailItem label='Dia chi' value={item?.address} />
            <DetailItem label='Email' value={item?.email} />
            <DetailItem label='So dien thoai' value={item?.phone} />
            <DetailItem label='Ngay tao' value={item ? formatDisplayDate(item.createdAt) : '-'} />
            <DetailItem label='Ghi chu' value={item?.note} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default LogisticInformationDetailPage

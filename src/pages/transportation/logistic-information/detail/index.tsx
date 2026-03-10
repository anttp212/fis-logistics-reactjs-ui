import { useNavigate, useParams } from 'react-router-dom'
import { FISButton } from 'fis-component'
import { ROUTES, buildTransportationLogisticInformationEditPath } from '@constants'
import { PageWrapper } from '@components'
import { CUSTOMER_TYPE_LABELS, PAYMENT_LABELS, formatDisplayDate, getLogisticDisplayName } from '../data'
import { useGetLogisticDetailQuery } from '../logisticInformation.api'

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-sm text-slate-500'>{label}</p>
    <p className='text-sm font-medium text-slate-800'>{value || '-'}</p>
  </div>
)

const LogisticInformationDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: item, isLoading } = useGetLogisticDetailQuery(id!, { skip: !id })

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin Logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Chi tiết logistic' }
  ]

  if (!id) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chi tiết logistic'
        breadcrumbItems={breadcrumbItems}
        onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
        hasBackButton
      >
        <div className='text-gray-500'>Không tìm thấy logistic.</div>
      </PageWrapper>
    )
  }

  if (isLoading || !item) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chi tiết logistic'
        breadcrumbItems={breadcrumbItems}
        onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
        hasBackButton
      >
        <div className='text-gray-500'>Đang tải dữ liệu...</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chi tiết logistic'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
      hasBackButton
    >
      <div className='space-y-6'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex justify-between items-start gap-4 mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-slate-800'>{getLogisticDisplayName(item)}</h3>
            </div>
            <FISButton
              variant='primary'
              onClick={() => navigate(buildTransportationLogisticInformationEditPath(item.id))}
            >
              Chỉnh sửa
            </FISButton>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <DetailItem label='Loại khách hàng' value={CUSTOMER_TYPE_LABELS[item.customerType]} />
            <DetailItem label='Thanh toán' value={PAYMENT_LABELS[item.paymentType]} />

            {item.customerType === 'BUSINESS' ? (
              <>
                <DetailItem label='Tên đơn vị' value={item.companyName} />
                <DetailItem label='Tên rút gọn' value={item.shortName} />
                <DetailItem label='Mã số thuế' value={item.taxCode} />
                <DetailItem label='Địa chỉ công ty' value={item.address} />
                <DetailItem label='Email' value={item.email} />
                <DetailItem label='Số điện thoại' value={item.phone} />
              </>
            ) : (
              <>
                <DetailItem label='Họ và tên' value={item.fullName} />
                <DetailItem label='CCCD/CMND' value={item.idCardNumber} />
                <DetailItem label='Địa chỉ' value={item.address} />
                <DetailItem label='Email' value={item.email} />
                <DetailItem label='Số điện thoại' value={item.phone} />
              </>
            )}

            <DetailItem label='Ngày tạo' value={formatDisplayDate(item.createdAt)} />
            <DetailItem label='Ghi chú' value={item.note} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default LogisticInformationDetailPage

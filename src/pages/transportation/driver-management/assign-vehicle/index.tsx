import { message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FISButton, FISSelect } from 'fis-component'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { MOCK_DRIVER_DATA, VEHICLE_ASSIGN_OPTIONS } from '../data'

interface AssignVehicleFormI {
  vehicleId: string
}

const DriverAssignVehiclePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const item = useMemo(() => MOCK_DRIVER_DATA.find((entry) => entry.id === id), [id])

  const { control, handleSubmit } = useForm<AssignVehicleFormI>({
    defaultValues: {}
  })

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Chỉ định xe' }
  ]

  const handleSave = handleSubmit(async (_values) => {
    message.success('Chỉ định xe thành công')
    navigate(ROUTES.transportationDriverManagement)
  })

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chỉ định xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
      hasBackButton
    >
      <div className='rounded-lg border border-gray-200 bg-white p-6 space-y-6'>
        <div>
          <p className='text-sm text-slate-500'>Tài xế</p>
          <p className='text-base font-medium text-slate-800'>{item?.fullName || '-'}</p>
          {/* <p className='text-sm text-slate-500 mt-2'>Xe hiện tại: {getVehicleLabel(item?.assignedVehicleId)}</p> */}
        </div>

        <Controller
          name='vehicleId'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              textLabel='Chọn xe'
              placeholder='Chọn xe để chỉ định'
              options={VEHICLE_ASSIGN_OPTIONS}
            />
          )}
        />

        <div className='flex justify-end gap-2'>
          <FISButton type='button' variant='secondary' onClick={() => navigate(ROUTES.transportationDriverManagement)}>
            Hủy
          </FISButton>
          <FISButton type='button' variant='primary' onClick={handleSave}>
            Lưu chỉ định
          </FISButton>
        </div>
      </div>
    </PageWrapper>
  )
}

export default DriverAssignVehiclePage

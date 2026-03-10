import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import type { UploadFile } from 'antd'
import { FISButton, FISInputArea, FISInputText, FISSelect, FISText } from 'fis-component'
import { LOGISTICS_OPTIONS, STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS, type FleetFormValuesI } from './data'

interface VehicleFleetFormPropsI {
  defaultValues: FleetFormValuesI
  submitLabel: string
  onSubmit: (values: FleetFormValuesI, files: UploadFile[]) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  defaultFileList?: UploadFile[]
}

const VehicleFleetForm = ({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultFileList = []
}: VehicleFleetFormPropsI) => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList)
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<FleetFormValuesI>({
    defaultValues
  })

  const vehicleType = watch('vehicleType')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, fileList))} className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          1. Thông tin xe
        </FISText>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='logisticsId'
            control={control}
            rules={{ required: 'Vui lòng chọn logistics' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Logistics'
                placeholder='Chọn logistics'
                options={LOGISTICS_OPTIONS}
                negative={!!errors.logisticsId}
                message={errors.logisticsId?.message}
              />
            )}
          />

          <Controller
            name='vehicleType'
            control={control}
            rules={{ required: 'Vui lòng chọn loại xe' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Loại xe'
                placeholder='Chọn loại xe'
                options={VEHICLE_TYPE_OPTIONS}
                negative={!!errors.vehicleType}
                message={errors.vehicleType?.message}
              />
            )}
          />

          <Controller
            name='plateNumber'
            control={control}
            rules={{ required: 'Vui lòng nhập biển số' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Biển số'
                placeholder='Nhập biển số'
                negative={!!errors.plateNumber}
                message={errors.plateNumber?.message}
              />
            )}
          />

          {vehicleType === 'TRAILER' && (
            <Controller
              name='secondaryPlateNumber'
              control={control}
              rules={{ required: 'Vui lòng nhập biển số phụ' }}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  required
                  textLabel='Biển số phụ'
                  placeholder='Nhập biển số phụ'
                  negative={!!errors.secondaryPlateNumber}
                  message={errors.secondaryPlateNumber?.message}
                />
              )}
            />
          )}

          <Controller
            name='payload'
            control={control}
            render={({ field }) => (
              <FISInputText {...field} type='number' textLabel='Tải trọng' placeholder='Nhập tải trọng' />
            )}
          />

          <Controller
            name='weight'
            control={control}
            render={({ field }) => (
              <FISInputText {...field} type='number' textLabel='Trọng lượng' placeholder='Nhập trọng lượng' />
            )}
          />

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FISSelect {...field} textLabel='Trạng thái' placeholder='Chọn trạng thái' options={STATUS_OPTIONS} />
            )}
          />
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Ghi chú
        </FISText>
        <Controller
          name='note'
          control={control}
          render={({ field }) => (
            <FISInputArea {...field} textLabel='Ghi chú' placeholder='Nhập ghi chú' maxLength={1000} />
          )}
        />
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Đính kèm file
        </FISText>
        <Upload
          action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
          listType='picture'
          fileList={fileList}
          onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
        >
          <Button type='primary' icon={<UploadOutlined />}>
            Upload
          </Button>
        </Upload>
      </div>

      <div className='sticky bottom-0 mt-12 pr-3 py-4 bg-[#EFF3FD] border-t border-gray-200 flex justify-end gap-2'>
        <FISButton type='button' variant='secondary' onClick={onCancel}>
          Hủy
        </FISButton>
        <FISButton type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : submitLabel}
        </FISButton>
      </div>
    </form>
  )
}

export default VehicleFleetForm

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Upload, message } from 'antd'
import { ExclamationCircleOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import PartnerModal from './components/PartnerModal'
import PartnersFilter from './components/PartnersFilter'
import { usePartners } from './usePartners'
import { buildPartnerDetailPath } from '@constants'

// Partner type
interface PartnerI {
  key: string
  name: string
  partnerCode: string
  taxCode: string
  partnerType: 'transport' | 'subcontractor'
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  qualityRating?: 'excellent' | 'good' | 'average' | 'poor'
  status?: string
}

// Fake data cho danh sách đối tác
const FAKE_PARTNERS_DATA: PartnerI[] = [
  {
    key: '1',
    name: 'Công ty Vận tải ABC',
    partnerCode: 'DT001',
    taxCode: '0123456789',
    partnerType: 'transport',
    phone: '0901234567',
    email: 'contact@abc-transport.com',
    address: '123 Đường ABC, Quận XYZ, Hà Nội',
    representativeName: 'Nguyễn Văn A',
    qualityRating: 'excellent',
    status: 'active'
  },
  {
    key: '2',
    name: 'Công ty Thầu phụ XYZ',
    partnerCode: 'DT002',
    taxCode: '0987654321',
    partnerType: 'subcontractor',
    phone: '0902345678',
    email: 'info@xyz-subcontractor.com',
    address: '456 Đường DEF, Quận 1, TP.HCM',
    representativeName: 'Trần Thị B',
    qualityRating: 'good',
    status: 'active'
  },
  {
    key: '3',
    name: 'Công ty Vận tải DEF',
    partnerCode: 'DT003',
    taxCode: '0111222333',
    partnerType: 'transport',
    phone: '0903456789',
    email: 'hello@def-transport.com',
    address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
    representativeName: 'Lê Văn C',
    qualityRating: 'average',
    status: 'inactive'
  },
  {
    key: '4',
    name: 'Công ty Thầu phụ GHI',
    partnerCode: 'DT004',
    taxCode: '0444555666',
    partnerType: 'subcontractor',
    phone: '0904567890',
    email: 'contact@ghi-subcontractor.com',
    address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
    representativeName: 'Phạm Thị D',
    qualityRating: 'poor',
    status: 'locked'
  }
]

// TableRowSelection type
interface TableRowSelectionI {
  selectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[]) => void
  renderCell?: (checked: boolean, record: any) => React.ReactNode
  columnTitle?: React.ReactNode
}

// Simple Checkbox component
interface CheckboxPropsI {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ checked = false, indeterminate = false, onChange }: CheckboxPropsI) => {
  return (
    <input
      type='checkbox'
      checked={checked}
      ref={(input) => {
        if (input) input.indeterminate = indeterminate
      }}
      onChange={onChange}
      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
    />
  )
}

const Partners = () => {
  const navigate = useNavigate()
  const partners = usePartners()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<PartnerI | null>(null)

  // Get filter values from form
  const filterValues = partners.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_PARTNERS_DATA]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((partner) => partner.name.toLowerCase().includes(searchTerm))
    }

    // Filter by partnerCode
    if (filterValues.partnerCode) {
      const searchTerm = filterValues.partnerCode.toLowerCase()
      filtered = filtered.filter((partner) => partner.partnerCode.toLowerCase().includes(searchTerm))
    }

    // Filter by taxCode
    if (filterValues.taxCode) {
      const searchTerm = filterValues.taxCode.toLowerCase()
      filtered = filtered.filter((partner) => partner.taxCode.toLowerCase().includes(searchTerm))
    }

    // Filter by partnerType
    if (filterValues.partnerType) {
      filtered = filtered.filter((partner) => partner.partnerType === filterValues.partnerType)
    }

    // Filter by status
    if (filterValues.status) {
      filtered = filtered.filter((partner) => partner.status === filterValues.status)
    }

    // Filter by qualityRating
    if (filterValues.qualityRating) {
      filtered = filtered.filter((partner) => partner.qualityRating === filterValues.qualityRating)
    }

    // Filter by search (general search)
    if (partners.search) {
      const searchTerm = partners.search.toLowerCase()
      filtered = filtered.filter(
        (partner) =>
          partner.name.toLowerCase().includes(searchTerm) ||
          partner.partnerCode.toLowerCase().includes(searchTerm) ||
          partner.taxCode.toLowerCase().includes(searchTerm) ||
          partner.representativeName?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, partners.search])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

  const toggleExpand = (key: string) => {
    setExpandedRowKeys((prevKeys: string[]) =>
      prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
    )
  }

  const isAllSelected = selectedRowKeys.length === dataSource.length
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length

  const handleSelect = (key: React.Key) => {
    setSelectedRowKeys((prevKeys: React.Key[]) =>
      prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
    )
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowKeys([])
    } else {
      setSelectedRowKeys(dataSource.map((item) => item.key))
    }
  }

  const rowSelection: TableRowSelectionI = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    renderCell: (checked: boolean, record: any) => (
      <FISTableCell icon={<Checkbox checked={checked} onChange={() => handleSelect(record.key)} />} hasBorder={false} />
    ),
    columnTitle: (
      <FISTableHeaderCell
        label=''
        rightComponent={
          <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={() => toggleSelectAll()} />
        }
        hasRightDivider={false}
      />
    )
  }

  const handleAddNew = () => {
    setEditingPartner(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: PartnerI) => {
    setEditingPartner(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPartner(null)
  }

  const handleModalSubmit = async (formData: any) => {
    try {
      if (editingPartner) {
        // TODO: Call API to update partner
        // eslint-disable-next-line no-console
        console.log('Update partner:', editingPartner.key, formData)
      } else {
        // TODO: Call API to create partner
        // eslint-disable-next-line no-console
        console.log('Create partner:', formData)
      }
      handleModalClose()
      // TODO: Refresh partner list
    } catch (_error) {
      // Error handling - TODO: Show error notification
    }
  }

  const handleActivateDeactivate = (record: PartnerI) => {
    const isDeactivating = record.status === 'active'
    const actionText = isDeactivating ? 'ngừng kích hoạt' : 'kích hoạt'

    Modal.confirm({
      title: `Xác nhận ${actionText}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn {actionText} đối tác này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.partnerCode}</p>
        </div>
      ),
      okText: isDeactivating ? 'Ngừng kích hoạt' : 'Kích hoạt',
      okType: isDeactivating ? 'danger' : 'default',
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: Call API to activate/deactivate partner
        // eslint-disable-next-line no-console
        console.log(`${isDeactivating ? 'Deactivate' : 'Activate'} partner:`, record.key)
        // TODO: Refresh partner list
      },
      onCancel: () => {}
    })
  }

  const handleLock = (record: PartnerI) => {
    Modal.confirm({
      title: 'Xác nhận khóa đối tác',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn khóa đối tác này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.partnerCode}</p>
          <p className='mt-1 text-sm text-red-500'>
            Đối tác sẽ bị khóa do vi phạm cam kết chất lượng và không thể sử dụng dịch vụ.
          </p>
        </div>
      ),
      okText: 'Khóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: Call API to lock partner
        // eslint-disable-next-line no-console
        console.log('Lock partner:', record.key)
        // TODO: Refresh partner list
      },
      onCancel: () => {}
    })
  }

  const handleExport = (format: 'pdf' | 'xlsx') => {
    // TODO: Implement export functionality
    // eslint-disable-next-line no-console
    console.log(`Export partners to ${format}`)
    message.info(`Chức năng xuất file ${format.toUpperCase()} đang được phát triển`)
  }

  const handleBulkImport = (file: File) => {
    // TODO: Implement bulk import functionality
    // eslint-disable-next-line no-console
    console.log('Bulk import partners from file:', file.name)
    message.info('Chức năng nhập liệu hàng loạt đang được phát triển')
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800'>
          Đang hợp tác
        </span>
      )
    }
    if (status === 'inactive') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800'>
          Ngừng hợp tác
        </span>
      )
    }
    return (
      <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800'>
        Đã khóa
      </span>
    )
  }

  const getQualityRatingBadge = (rating?: string) => {
    if (rating === 'excellent') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800'>
          Xuất sắc
        </span>
      )
    }
    if (rating === 'good') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800'>
          Tốt
        </span>
      )
    }
    if (rating === 'average') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800'>
          Trung bình
        </span>
      )
    }
    if (rating === 'poor') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800'>
          Kém
        </span>
      )
    }
    return <span className='text-gray-500'>-</span>
  }

  const getPartnerTypeLabel = (type?: string) => {
    if (type === 'transport') return 'Đối tác vận tải'
    if (type === 'subcontractor') return 'Thầu phụ'
    return '-'
  }

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 250,
      title: () => {
        return <FISTableHeaderCell label='Tên đối tác' hasRightDivider />
      },
      render: (_: any, row: PartnerI) => (
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildPartnerDetailPath(row.key))}
              className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left'
            >
              {row.name}
            </button>
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 150,
      title: () => <FISTableHeaderCell label='Mã đối tác' hasRightDivider />,
      render: (_: any, row: PartnerI) => <FISTableCell content={row.partnerCode} textAlign='left' />
    },
    {
      dataIndex: 'partnerType',
      key: 'partnerType',
      width: 150,
      title: () => <FISTableHeaderCell label='Loại đối tác' hasRightDivider />,
      render: (_: any, row: PartnerI) => (
        <FISTableCell content={getPartnerTypeLabel(row.partnerType)} textAlign='left' />
      )
    },
    {
      dataIndex: 'qualityRating',
      key: 'qualityRating',
      width: 150,
      title: () => <FISTableHeaderCell label='Xếp hạng' hasRightDivider />,
      render: (_: any, row: PartnerI) => getQualityRatingBadge(row.qualityRating)
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: PartnerI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 180,
      render: (_: any, record: PartnerI) => (
        <FISTableCell
          style={{ textAlign: 'center' }}
          icon={
            <FISButtonGroup
              size='md'
              options={[
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      }
                      variant='tertiary-invisible'
                      color='blue'
                      onClick={() => handleEdit(record)}
                    />
                  )
                },
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        record.status === 'active' ? (
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
                            />
                          </svg>
                        ) : (
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                        )
                      }
                      variant='tertiary-invisible'
                      color={record.status === 'active' ? 'orange' : 'green'}
                      onClick={() => handleActivateDeactivate(record)}
                      title={record.status === 'active' ? 'Ngừng kích hoạt' : 'Kích hoạt'}
                    />
                  )
                },
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                      }
                      variant='secondary-invisible-negative'
                      onClick={() => handleLock(record)}
                      title='Khóa đối tác'
                    />
                  )
                }
              ]}
            />
          }
        />
      )
    }
  ]

  return (
    <PageWrapper className='py-5' title='Hồ sơ đối tác' breadcrumbItems={partners.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<PartnersFilter control={partners.control} />}
          actionButtons={
            <div className='flex gap-2'>
              <Upload
                accept='.xlsx,.xls'
                beforeUpload={(file) => {
                  handleBulkImport(file)
                  return false
                }}
                showUploadList={false}
              >
                <FISButton variant='secondary' startIcon={<UploadOutlined />}>
                  Nhập Excel
                </FISButton>
              </Upload>
              <FISButton variant='secondary' startIcon={<DownloadOutlined />} onClick={() => handleExport('xlsx')}>
                Xuất Excel
              </FISButton>
              <FISButton variant='secondary' startIcon={<DownloadOutlined />} onClick={() => handleExport('pdf')}>
                Xuất PDF
              </FISButton>
              <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
                Khai báo mới
              </FISButton>
            </div>
          }
          {...partners}
          searchPlaceholder='Tìm kiếm đối tác...'
        />

        {/* FISTable */}
        <div className='flex-1 bg-white rounded-lg overflow-hidden p-4'>
          <FISTable
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowKeys,
              expandedRowRender: (record: PartnerI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Email:</strong> {record.email || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Địa chỉ:</strong> {record.address || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Người đại diện:</strong> {record.representativeName || '-'}
                  </p>
                </div>
              ),
              onExpand: (_expanded, record) => toggleExpand(record.key),
              expandIcon: () => null,
              expandIconColumnIndex: -1
            }}
          />
        </div>
      </div>

      {/* Partner Modal */}
      <PartnerModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingPartner}
      />
    </PageWrapper>
  )
}

export default Partners

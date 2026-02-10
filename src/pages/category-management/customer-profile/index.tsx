import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Upload, message } from 'antd'
import { ExclamationCircleOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import CustomerModal from './components/CustomerModal'
import CustomersFilter from './components/CustomersFilter'
import { useCustomers } from './useCustomers'
import { buildCustomerDetailPath } from '@constants'

// Customer type
interface CustomerI {
  key: string
  name: string
  customerCode: string
  taxCode: string
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  logo?: string
  status?: string
}

// Fake data cho danh sách khách hàng
const FAKE_CUSTOMERS_DATA: CustomerI[] = [
  {
    key: '1',
    name: 'Công ty TNHH ABC',
    customerCode: 'KH001',
    taxCode: '0123456789',
    phone: '0901234567',
    email: 'contact@abc.com',
    address: '123 Đường ABC, Quận XYZ, Hà Nội',
    representativeName: 'Nguyễn Văn A',
    status: 'active'
  },
  {
    key: '2',
    name: 'Công ty Cổ phần XYZ',
    customerCode: 'KH002',
    taxCode: '0987654321',
    phone: '0902345678',
    email: 'info@xyz.com',
    address: '456 Đường DEF, Quận 1, TP.HCM',
    representativeName: 'Trần Thị B',
    status: 'active'
  },
  {
    key: '3',
    name: 'Công ty TNHH DEF',
    customerCode: 'KH003',
    taxCode: '0111222333',
    phone: '0903456789',
    email: 'hello@def.com',
    address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
    representativeName: 'Lê Văn C',
    status: 'inactive'
  },
  {
    key: '4',
    name: 'Công ty Cổ phần GHI',
    customerCode: 'KH004',
    taxCode: '0444555666',
    phone: '0904567890',
    email: 'contact@ghi.com',
    address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
    representativeName: 'Phạm Thị D',
    status: 'archived'
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

const Customers = () => {
  const navigate = useNavigate()
  const customers = useCustomers()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerI | null>(null)

  // Get filter values from form
  const filterValues = customers.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_CUSTOMERS_DATA]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((cust) => cust.name.toLowerCase().includes(searchTerm))
    }

    // Filter by customerCode
    if (filterValues.customerCode) {
      const searchTerm = filterValues.customerCode.toLowerCase()
      filtered = filtered.filter((cust) => cust.customerCode.toLowerCase().includes(searchTerm))
    }

    // Filter by taxCode
    if (filterValues.taxCode) {
      const searchTerm = filterValues.taxCode.toLowerCase()
      filtered = filtered.filter((cust) => cust.taxCode.toLowerCase().includes(searchTerm))
    }

    // Filter by status
    if (filterValues.status) {
      filtered = filtered.filter((cust) => cust.status === filterValues.status)
    }

    // Filter by search (general search)
    if (customers.search) {
      const searchTerm = customers.search.toLowerCase()
      filtered = filtered.filter(
        (cust) =>
          cust.name.toLowerCase().includes(searchTerm) ||
          cust.customerCode.toLowerCase().includes(searchTerm) ||
          cust.taxCode.toLowerCase().includes(searchTerm) ||
          cust.representativeName?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, customers.search])

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
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: CustomerI) => {
    setEditingCustomer(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleModalSubmit = async (formData: any) => {
    try {
      if (editingCustomer) {
        // TODO: Call API to update customer
        // eslint-disable-next-line no-console
        console.log('Update customer:', editingCustomer.key, formData)
      } else {
        // TODO: Call API to create customer
        // eslint-disable-next-line no-console
        console.log('Create customer:', formData)
      }
      handleModalClose()
      // TODO: Refresh customer list
    } catch (_error) {
      // Error handling - TODO: Show error notification
    }
  }

  const handleDelete = (record: CustomerI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa hồ sơ khách hàng này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.customerCode}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: Call API to delete customer
        // eslint-disable-next-line no-console
        console.log('Delete customer:', record.key)
        // TODO: Refresh customer list
      },
      onCancel: () => {}
    })
  }

  const handleArchive = (record: CustomerI) => {
    Modal.confirm({
      title: 'Xác nhận lưu trữ',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn lưu trữ hồ sơ khách hàng này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.customerCode}</p>
          <p className='mt-1 text-sm text-gray-500'>Hồ sơ sẽ được chuyển sang trạng thái lưu trữ.</p>
        </div>
      ),
      okText: 'Lưu trữ',
      okType: 'default',
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: Call API to archive customer
        // eslint-disable-next-line no-console
        console.log('Archive customer:', record.key)
        // TODO: Refresh customer list
      },
      onCancel: () => {}
    })
  }

  const handleExport = (format: 'pdf' | 'xlsx') => {
    // TODO: Implement export functionality
    // eslint-disable-next-line no-console
    console.log(`Export customers to ${format}`)
    message.info(`Chức năng xuất file ${format.toUpperCase()} đang được phát triển`)
  }

  const handleBulkImport = (file: File) => {
    // TODO: Implement bulk import functionality
    // eslint-disable-next-line no-console
    console.log('Bulk import customers from file:', file.name)
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
      <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800'>
        Đã lưu trữ
      </span>
    )
  }

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 250,
      title: () => {
        return <FISTableHeaderCell label='Tên khách hàng' hasRightDivider />
      },
      render: (_: any, row: CustomerI) => (
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildCustomerDetailPath(row.key))}
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
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 150,
      title: () => <FISTableHeaderCell label='Mã khách hàng' hasRightDivider />,
      render: (_: any, row: CustomerI) => <FISTableCell content={row.customerCode} textAlign='left' />
    },
    {
      dataIndex: 'taxCode',
      key: 'taxCode',
      width: 150,
      title: () => <FISTableHeaderCell label='Mã số thuế' hasRightDivider />,
      render: (_: any, row: CustomerI) => <FISTableCell content={row.taxCode} textAlign='left' />
    },
    {
      dataIndex: 'representativeName',
      key: 'representativeName',
      width: 200,
      title: () => <FISTableHeaderCell label='Người đại diện' hasRightDivider />,
      render: (_: any, row: CustomerI) => <FISTableCell content={row.representativeName || '-'} textAlign='left' />
    },
    {
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      title: () => <FISTableHeaderCell label='Số điện thoại' hasRightDivider />,
      render: (_: any, row: CustomerI) => <FISTableCell content={row.phone || '-'} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: CustomerI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: CustomerI) => (
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
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                          />
                        </svg>
                      }
                      variant='tertiary-invisible'
                      color='orange'
                      onClick={() => handleArchive(record)}
                      title='Lưu trữ'
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
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      }
                      variant='secondary-invisible-negative'
                      onClick={() => handleDelete(record)}
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
    <PageWrapper className='p-5' title='Hồ sơ khách hàng' breadcrumbItems={customers.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<CustomersFilter control={customers.control} />}
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
          {...customers}
          searchPlaceholder='Tìm kiếm khách hàng...'
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
              expandedRowRender: (record: CustomerI) => (
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

      {/* Customer Modal */}
      <CustomerModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingCustomer}
      />
    </PageWrapper>
  )
}

export default Customers

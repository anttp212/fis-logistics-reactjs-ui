import type { ColumnsType } from 'antd/es/table'
import { FISBadge, FISPagination, FISSorter, FISTable, FISTableCell, FISTableHeaderCell } from 'fis-component'
import { formatDisplay } from '@utils'
import { useCostGroupContext } from '..'
import type { CostGroupT } from '../types'

type SortedInfoT = { columnKey?: string; order?: string }
type HandleSortT = (columnKey?: string, order?: string) => void

const getColumns = (sortedInfo: SortedInfoT, handleSort: HandleSortT): ColumnsType<CostGroupT> => [
  {
    title: () => (
      <FISTableHeaderCell
        rightComponent={<FISSorter columnKey='code' onSort={handleSort} sortedInfo={sortedInfo} />}
        label='Cost Group Code'
      />
    ),
    dataIndex: 'code',
    key: 'code',
    width: 160,
    render: (value) => <FISTableCell content={formatDisplay(value)} />
  },
  {
    title: () => (
      <FISTableHeaderCell
        rightComponent={<FISSorter columnKey='name' onSort={handleSort} sortedInfo={sortedInfo} />}
        label='Cost Group Name'
      />
    ),
    dataIndex: 'name',
    key: 'name',
    width: 260,
    render: (value) => <FISTableCell content={formatDisplay(value)} />
  },
  {
    title: () => (
      <FISTableHeaderCell
        rightComponent={<FISSorter columnKey='remark' onSort={handleSort} sortedInfo={sortedInfo} />}
        label='Remark'
      />
    ),
    dataIndex: 'remark',
    width: '100%',
    key: 'remark',
    render: (value) => <FISTableCell content={formatDisplay(value)} />
  },
  {
    title: () => (
      <FISTableHeaderCell
        rightComponent={<FISSorter columnKey='status' onSort={handleSort} sortedInfo={sortedInfo} />}
        label='Status'
      />
    ),
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (value) => (
      <FISTableCell
        content={<FISBadge size='md' label={value} status={value === 'Active' ? 'positive' : 'negative'} />}
      />
    )
  }
]

const MOCK_COST_GROUPS: CostGroupT[] = [
  { id: '1', code: 'OPEX', name: 'Operating Expenditure', remark: 'Costs related to operations', status: 'Active' },
  { id: '2', code: 'TRUK', name: 'Trucking Operations', remark: 'Trucking/linehaul costs', status: 'Active' },
  { id: '3', code: 'SEAF', name: 'Operating – SEA Freight', remark: 'Sea freight related costs', status: 'Active' },
  { id: '4', code: 'AIRF', name: 'Operating – AIR Freight', remark: 'Air freight related costs', status: 'Active' },
  {
    id: '5',
    code: 'ADMO',
    name: 'General Administration & Office',
    remark: 'Office and admin costs',
    status: 'Inactive'
  },
  { id: '1', code: 'OPEX', name: 'Operating Expenditure', remark: 'Costs related to operations', status: 'Active' },
  { id: '2', code: 'TRUK', name: 'Trucking Operations', remark: 'Trucking/linehaul costs', status: 'Active' },
  { id: '3', code: 'SEAF', name: 'Operating – SEA Freight', remark: 'Sea freight related costs', status: 'Active' },
  { id: '4', code: 'AIRF', name: 'Operating – AIR Freight', remark: 'Air freight related costs', status: 'Active' },
  {
    id: '5',
    code: 'ADMO',
    name: 'General Administration & Office',
    remark: 'Office and admin costs',
    status: 'Inactive'
  },
  { id: '1', code: 'OPEX', name: 'Operating Expenditure', remark: 'Costs related to operations', status: 'Active' },
  { id: '2', code: 'TRUK', name: 'Trucking Operations', remark: 'Trucking/linehaul costs', status: 'Active' },
  { id: '3', code: 'SEAF', name: 'Operating – SEA Freight', remark: 'Sea freight related costs', status: 'Active' },
  { id: '4', code: 'AIRF', name: 'Operating – AIR Freight', remark: 'Air freight related costs', status: 'Active' },
  {
    id: '5',
    code: 'ADMO',
    name: 'General Administration & Office',
    remark: 'Office and admin costs',
    status: 'Inactive'
  },
  { id: '1', code: 'OPEX', name: 'Operating Expenditure', remark: 'Costs related to operations', status: 'Active' },
  { id: '2', code: 'TRUK', name: 'Trucking Operations', remark: 'Trucking/linehaul costs', status: 'Active' },
  { id: '3', code: 'SEAF', name: 'Operating – SEA Freight', remark: 'Sea freight related costs', status: 'Active' },
  { id: '4', code: 'AIRF', name: 'Operating – AIR Freight', remark: 'Air freight related costs', status: 'Active' },
  {
    id: '5',
    code: 'ADMO',
    name: 'General Administration & Office',
    remark: 'Office and admin costs',
    status: 'Inactive'
  }
]

const CostGroupTable = () => {
  const { sortedInfo, handleSort } = useCostGroupContext()
  const columns = getColumns(sortedInfo, handleSort)

  return (
    <div className='flex flex-1 gap-2 flex-col'>
      <FISTable dataSource={MOCK_COST_GROUPS} columns={columns} rowKey={'id'} scroll={{ y: 'calc(100vh - 340px)' }} />
      <FISPagination />
    </div>
  )
}

export default CostGroupTable

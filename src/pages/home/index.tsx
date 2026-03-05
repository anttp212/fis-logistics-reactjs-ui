import { useMemo } from 'react'
import { Chart } from 'react-google-charts'

const DUMP_OVERVIEW = {
  orders: {
    total: 20,
    pending: 11,
    inProgress: 2,
    completed: 5,
    cancelled: 2,
    incident: 0,
    rejected: 0,
    completionRate: 25
  },
  drivers: {
    total: 10,
    available: 6,
    busy: 3,
    offline: 1
  },
  security: {
    todayCheckIn: 15,
    todayCheckOut: 12,
    pendingRegistrations: 3,
    openIncidents: 1
  }
}

const lineOptions = {
  backgroundColor: 'transparent',
  legend: { position: 'none' },
  colors: ['#4F46E5'],
  chartArea: { width: '90%', height: '70%' },
  curveType: 'function'
}

const barOptions = {
  backgroundColor: 'transparent',
  legend: { position: 'none' },
  colors: ['#4F46E5'],
  chartArea: { width: '80%', height: '70%' }
}

const donutOptions = {
  backgroundColor: 'transparent',
  legend: { position: 'bottom' },
  pieHole: 0.6,
  colors: ['#10B981', '#F59E0B', '#EF4444'],
  chartArea: { width: '90%', height: '75%' }
}

const Home = () => {
  const overview = DUMP_OVERVIEW

  /* ================= LINE CHART (Fake 7 days) ================= */
  const lineData = useMemo(() => {
    const totalToday = overview.security.todayCheckIn + overview.security.todayCheckOut

    return [
      ['Ngày', 'Ra vào cổng'],
      ['T2', totalToday - 5],
      ['T3', totalToday - 2],
      ['T4', totalToday - 8],
      ['T5', totalToday + 3],
      ['T6', totalToday - 1],
      ['T7', totalToday + 4],
      ['CN', totalToday]
    ]
  }, [overview.security.todayCheckIn, overview.security.todayCheckOut])

  /* ================= BAR CHART ================= */
  const ordersBarData = useMemo(() => {
    return [
      ['Trạng thái', 'Số lượng'],
      ['Chờ xác nhận', overview.orders.pending],
      ['Đang thực hiện', overview.orders.inProgress],
      ['Hoàn thành', overview.orders.completed],
      ['Huỷ', overview.orders.cancelled]
    ]
  }, [overview.orders.pending, overview.orders.inProgress, overview.orders.completed, overview.orders.cancelled])

  /* ================= DONUT ================= */
  const driversDonutData = useMemo(() => {
    return [
      ['Trạng thái', 'Số lượng'],
      ['Sẵn sàng', overview.drivers.available],
      ['Bận', overview.drivers.busy],
      ['Offline', overview.drivers.offline]
    ]
  }, [overview.drivers.available, overview.drivers.busy, overview.drivers.offline])

  return (
    <div className='space-y-6 pb-6 h-full overflow-y-auto'>
      {/* ================= KPI CARDS ================= */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Ra vào cổng" value={27} />
        <KpiCard title="Tài xế" value={overview.drivers.total} />
        <KpiCard title="Lệnh điều xe" value={overview.orders.total} />
      </div> */}

      {/* ================= LINE ================= */}
      <div className='bg-white rounded-2xl shadow-sm border p-6'>
        <h2 className='text-lg font-medium text-slate-700 mb-4'>Ra vào cổng - 7 ngày gần nhất</h2>

        <Chart chartType='LineChart' width='100%' height='350px' data={lineData} options={lineOptions} />
      </div>

      {/* ================= 2 COL ================= */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* ORDERS */}
        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <h2 className='text-lg font-medium text-slate-700 mb-4'>Lệnh điều xe</h2>

          <Chart chartType='BarChart' width='100%' height='320px' data={ordersBarData} options={barOptions} />
        </div>

        {/* DRIVERS */}
        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <h2 className='text-lg font-medium text-slate-700 mb-4'>Tài xế</h2>

          <Chart chartType='PieChart' width='100%' height='320px' data={driversDonutData} options={donutOptions} />
        </div>
      </div>
    </div>
  )
}

/* ================= KPI COMPONENT ================= */

// const KpiCard = ({ title, value }: { title: string; value: number }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-6">
//       <p className="text-sm text-slate-500">{title}</p>
//       <h2 className="text-3xl font-semibold text-slate-800 mt-2">
//         {value}
//       </h2>
//     </div>
//   )
// }

export default Home

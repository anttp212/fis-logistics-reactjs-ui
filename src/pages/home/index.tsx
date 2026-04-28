import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Chart } from 'react-google-charts'
import { FISButton, FISInputDate } from 'fis-component'
import { useGetSecurityStatsQuery } from '@pages/report/gate-in-out/gateInOut.api'
import { useGetCoordinatorReportQuery, useGetDashboardOverviewQuery } from './dashboard.api'
import dayjs from '@utils/dayjs'

type SecurityStatsParamsT = { fromDate?: string; toDate?: string }
type HomeFilterValuesT = { fromDate: Date | null; toDate: Date | null }

const formatDateForApi = (d: Date, boundary: 'start' | 'end') => {
  const date = new Date(d)
  if (boundary === 'start') {
    date.setHours(0, 0, 0, 0)
  } else {
    date.setHours(23, 59, 59, 999)
  }
  return date.toISOString()
}

const getDefaultFromTo = () => {
  const to = new Date()
  to.setHours(23, 59, 59, 999) // cuối ngày

  const from = new Date(to)
  from.setDate(from.getDate() - 6)
  from.setHours(0, 0, 0, 0) // đầu ngày

  return { from, to }
}

const lineOptions = {
  backgroundColor: 'transparent',
  legend: { position: 'top' },
  colors: ['#10B981', '#4F46E5', '#fc5555'],
  chartArea: {
    width: '90%',
    height: '70%',
    top: 20,
    bottom: 20,
    left: 40,
    right: 20
  },
  hAxis: {
    viewWindow: {
      min: 0
    }
  }
}

const barOptions = {
  backgroundColor: 'transparent',
  legend: {
    position: 'bottom', // 👈 ghi chú xuống dưới
    maxLines: 3
  },
  bar: { groupWidth: '100%' },
  chartArea: {
    top: 20,
    bottom: 40,
    left: 40,
    right: 20
  }
}

const defaultFromTo = getDefaultFromTo()

const Home = () => {
  const [appliedParams, setAppliedParams] = useState<SecurityStatsParamsT | null>({
    fromDate: formatDateForApi(defaultFromTo.from as Date, 'start'),
    toDate: formatDateForApi(defaultFromTo.to as Date, 'end')
  })

  const [appliedParamsCoordinator, setAppliedParamsCoordinator] = useState<SecurityStatsParamsT | null>({
    fromDate: formatDateForApi(defaultFromTo.from as Date, 'start'),
    toDate: formatDateForApi(defaultFromTo.to as Date, 'end')
  })
  const [coordinatorFilterTriggered, setCoordinatorFilterTriggered] = useState(false)

  const { control, handleSubmit, setValue, watch } = useForm<HomeFilterValuesT>({
    defaultValues: {
      fromDate: defaultFromTo.from as Date,
      toDate: defaultFromTo.to as Date
    }
  })

  const selectedFromDate = watch('fromDate')
  const selectedFromDateMin = selectedFromDate ? dayjs(selectedFromDate) : undefined

  const { data: securityStats } = useGetSecurityStatsQuery(appliedParams ?? undefined, {})
  const { data: coordinatorReport, isFetching: isCoordinatorFetching } = useGetCoordinatorReportQuery(
    appliedParamsCoordinator ?? undefined
  )

  const { data: overview } = useGetDashboardOverviewQuery()

  const handleFilter = handleSubmit((values) => {
    setAppliedParams({
      fromDate: values.fromDate ? formatDateForApi(values.fromDate, 'start') : undefined,
      toDate: values.toDate ? formatDateForApi(values.toDate, 'end') : undefined
    })
  })

  const handleFilterCoordinator = handleSubmit((values) => {
    setCoordinatorFilterTriggered(true)
    setAppliedParamsCoordinator({
      fromDate: values.fromDate ? formatDateForApi(values.fromDate, 'start') : undefined,
      toDate: values.toDate ? formatDateForApi(values.toDate, 'end') : undefined
    })
  })

  /* ================= LINE CHART (Ra vào cổng từ API) ================= */
  const lineData = useMemo(() => {
    const stats = securityStats?.dailyStats ?? []
    const header: (string | number)[][] = [['Ngày', 'Vào', 'Ra', 'Sự cố']]
    const rows = stats.map((d) => {
      const dateStr = d.date
      const dd = dateStr ? new Date(dateStr) : null
      const label =
        dd && !isNaN(dd.getTime())
          ? `${String(dd.getDate()).padStart(2, '0')}/${String(dd.getMonth() + 1).padStart(2, '0')}`
          : (dateStr ?? '')
      return [label, d.checkIn, d.checkOut, d.incidents]
    })
    const data = header.concat(rows)
    return data.length > 1 ? data : header.concat([['—', 0, 0, 0]])
  }, [securityStats?.dailyStats])

  /* ================= BAR CHART - LỆNH ĐIỀU XE THEO LOẠI XE ================= */
  const ordersBarData = useMemo(() => {
    const stats = coordinatorReport?.stats ?? []

    const init = () => ({
      cancelled: 0,
      completed: 0,
      inProgress: 0,
      inTransit: 0,
      incident: 0,
      pendingConfirmation: 0,
      rejected: 0
    })

    const sum = {
      container: init(),
      internalVehicle: init(),
      transportVehicle: init()
    }

    stats.forEach((day) => {
      ;(['container', 'internalVehicle', 'transportVehicle'] as const).forEach((k) => {
        const s = (day as any)[k]
        if (!s) return
        sum[k].cancelled += s.cancelled ?? 0
        sum[k].completed += s.completed ?? 0
        sum[k].inProgress += s.inProgress ?? 0
        sum[k].inTransit += s.inTransit ?? 0
        sum[k].incident += s.incident ?? 0
        sum[k].pendingConfirmation += s.pendingConfirmation ?? 0
        sum[k].rejected += s.rejected ?? 0
      })
    })

    return sum
  }, [coordinatorReport?.stats])

  const kpiTotals = useMemo(() => {
    const totalRejected =
      ordersBarData.container.rejected +
      ordersBarData.internalVehicle.rejected +
      ordersBarData.transportVehicle.rejected
    return {
      pending: coordinatorReport?.pendingOrders ?? 0,
      inProgress: coordinatorReport?.inProgressOrders ?? 0,
      completed: coordinatorReport?.completedOrders ?? 0,
      cancelled: coordinatorReport?.cancelledOrders ?? 0,
      rejected: totalRejected,
      incident: coordinatorReport?.incidentOrders ?? 0
    }
  }, [coordinatorReport, ordersBarData])

  const ordersBarChartData = useMemo(() => {
    const sum = ordersBarData

    return [
      ['Loại xe', 'Chờ xác nhận', 'Đang thực hiện', 'Đang vận chuyển', 'Hoàn thành', 'Huỷ', 'Từ chối', 'Sự cố'],
      [
        'Container',
        sum.container.pendingConfirmation,
        sum.container.inProgress,
        sum.container.inTransit,
        sum.container.completed,
        sum.container.cancelled,
        sum.container.rejected,
        sum.container.incident
      ],
      [
        'Xe nội bộ',
        sum.internalVehicle.pendingConfirmation,
        sum.internalVehicle.inProgress,
        sum.internalVehicle.inTransit,
        sum.internalVehicle.completed,
        sum.internalVehicle.cancelled,
        sum.internalVehicle.rejected,
        sum.internalVehicle.incident
      ],
      [
        'Xe vận tải',
        sum.transportVehicle.pendingConfirmation,
        sum.transportVehicle.inProgress,
        sum.transportVehicle.inTransit,
        sum.transportVehicle.completed,
        sum.transportVehicle.cancelled,
        sum.transportVehicle.rejected,
        sum.transportVehicle.incident
      ]
    ]
  }, [ordersBarData])

  return (
    <div className='space-y-6 pb-6 h-full overflow-y-auto'>
      {/* ================= KPI CARDS ================= */}

      {/* ================= LINE ================= */}
      <div className='bg-white rounded-2xl shadow-sm border p-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-medium text-slate-700 mb-4'>Ra vào cổng</h2>
          <div className='flex flex-wrap items-end gap-4 mb-4'>
            <Controller
              control={control}
              name='fromDate'
              render={({ field }) => (
                <FISInputDate
                  textLabel='Từ ngày'
                  placeholder='Chọn ngày'
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    setValue('toDate', null)
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name='toDate'
              render={({ field }) => (
                <FISInputDate
                  textLabel='Đến ngày'
                  placeholder='Chọn ngày'
                  value={field.value}
                  onChange={field.onChange}
                  minDate={selectedFromDateMin}
                />
              )}
            />
            <FISButton variant='primary' onClick={handleFilter}>
              Lọc
            </FISButton>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-4'>
          <KpiCard title='Tổng Đăng Ký' value={securityStats?.totalRegistrations ?? 0} />
          <KpiCard title='Đã vào' value={securityStats?.totalCheckIn ?? 0} />
          <KpiCard title='Đã ra' value={securityStats?.totalCheckOut ?? 0} />
          <KpiCard
            title='Chưa vào cổng'
            value={(securityStats?.totalRegistrations ?? 0) - (securityStats?.totalCheckIn ?? 0)}
          />
          {/* <KpiCard title='Còn lại' value={((securityStats?.totalRegistrations ?? 0) - (securityStats?.totalCheckIn ?? 0) - (securityStats?.totalCheckOut ?? 0))} /> */}
        </div>
        <Chart chartType='LineChart' width='100%' height='350px' data={lineData} options={lineOptions} />
      </div>

      {/* ================= 2 COL ================= */}
      <div className='bg-white rounded-2xl shadow-sm border '>
        <div className='flex justify-between items-center p-6 pb-0'>
          <h2 className='text-lg font-medium text-slate-700 mb-4'>Lệnh điều xe</h2>
          <div className='flex flex-wrap items-end gap-4 mb-4'>
            <Controller
              control={control}
              name='fromDate'
              render={({ field }) => (
                <FISInputDate
                  textLabel='Từ ngày'
                  placeholder='Chọn ngày'
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    setValue('toDate', null)
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name='toDate'
              render={({ field }) => (
                <FISInputDate
                  textLabel='Đến ngày'
                  value={field.value}
                  placeholder='Chọn ngày'
                  onChange={field.onChange}
                  minDate={selectedFromDateMin}
                />
              )}
            />
            <FISButton
              variant='primary'
              onClick={handleFilterCoordinator}
              disabled={coordinatorFilterTriggered && isCoordinatorFetching}
            >
              {coordinatorFilterTriggered && isCoordinatorFetching ? 'Đang lọc...' : 'Lọc'}
            </FISButton>
          </div>
        </div>
        {/* ORDERS */}
        <div className='grid grid-cols-1 md:grid-cols-[70%_30%] '>
          <div className='p-6 justify-end items-end'>
            <Chart chartType='ColumnChart' width='100%' height='320px' data={ordersBarChartData} options={barOptions} />
          </div>

          {/* DRIVERS */}
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
              <KpiCard title='Chờ xác nhận' value={kpiTotals.pending} />
              <KpiCard title='Đang thực hiện' value={kpiTotals.inProgress} />
              <KpiCard title='Hoàn thành' value={kpiTotals.completed} />
              <KpiCard title='Huỷ' value={kpiTotals.cancelled} />
              <KpiCard title='Từ chối' value={kpiTotals.rejected} />
              <KpiCard title='Sự cố' value={kpiTotals.incident} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= KPI COMPONENT ================= */

const KpiCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className='bg-white rounded-2xl shadow-sm border p-6'>
      <p className='text-sm text-slate-500'>{title}</p>
      <h2 className='text-3xl font-semibold text-slate-800 mt-2'>{value}</h2>
    </div>
  )
}

export default Home

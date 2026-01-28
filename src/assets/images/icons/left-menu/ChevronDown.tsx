export const ChevronDownIcon = ({ size = 20, stroke = 'white', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M5 7.5L10 12.5L15 7.5' stroke={stroke} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export const ExpandIcon = ({ size = 16, color = '#236CBC', strokeWidth = 1.5, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 4.66634L8.66667 7.99968L12 11.333M7.33333 4.66634L4 7.99968L7.33333 11.333'
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

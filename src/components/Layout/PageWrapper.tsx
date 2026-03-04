import { BackIcon } from '@images'
import { FISBreadcrumb, FISIconButton, FISText } from 'fis-component'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface BreadcrumbItemPropsI extends ComponentPropsWithoutRef<'button'> {
  icon?: ReactNode
  label?: string
  active?: boolean
  onClick?: () => void
}

interface PageWrapperPropsI {
  title?: string
  children: ReactNode
  hasBackButton?: boolean
  onBackClick?: () => void
  breadcrumbItems?: BreadcrumbItemPropsI[]
  actionButtons?: ReactNode
  className?: string
}

const PageWrapper: React.FC<PageWrapperPropsI> = ({
  className,
  children,
  breadcrumbItems = [],
  title = '',
  hasBackButton = false,
  onBackClick,
  actionButtons
}) => {
  return (
    <div className={`flex w-full h-full flex-col`}>
      <FISBreadcrumb items={breadcrumbItems || []} />

      <div className=' mt-1 flex justify-between items-center'>
        <div className='flex gap-2 justify-center items-center'>
          {hasBackButton && (
            <FISIconButton
              variant='tertiary-invisible'
              icon={<BackIcon />}
              onClick={onBackClick}
              title='Quay lại trang danh sách'
            />
          )}
          <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2'>
            {title}
          </FISText>
        </div>

        <div>{actionButtons}</div>
      </div>
      <div className={`h-full rounded-tr-2xl rounded-tl-2xl ${className}`}>{children}</div>
    </div>
  )
}

export default PageWrapper

import { Drawer } from 'antd'
import { FISButton } from 'fis-component'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface DrawerI {
  open: boolean
  title?: string
  onClose: () => void
  onSave?: () => void
  onReset?: () => void
  children?: React.ReactNode
}
const FISDrawer: FC<DrawerI> = ({ open, onClose, title, onReset, onSave, children }) => {
  const { t } = useTranslation()
  return (
    <Drawer
      footer={
        <div className=' flex items-center justify-between'>
          <FISButton variant='primary-white' onClick={onReset}>
            {t('common.actions.reset')}
          </FISButton>
          <div className=' flex gap-2'>
            <FISButton variant='secondary' onClick={onClose}>
              {t('common.actions.cancel')}
            </FISButton>
            <FISButton onClick={onSave}>{t('common.actions.save')}</FISButton>
          </div>
        </div>
      }
      title={title}
      onClose={onClose}
      open={open}
    >
      {children}
    </Drawer>
  )
}

export default FISDrawer

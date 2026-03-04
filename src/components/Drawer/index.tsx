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
  textCancel?: string
  textSave?: string
  textReset?: string
}
const FISDrawer: FC<DrawerI> = ({ open, onClose, title, onReset, onSave, children, textCancel, textSave, textReset }) => {
  const { t } = useTranslation()
  return (
    <Drawer
      footer={
        <div className=' flex items-center justify-between'>
          <FISButton variant='primary-white' onClick={onReset}>
            {textReset || t('common.actions.reset')}
          </FISButton>
          <div className=' flex gap-2'>
            <FISButton variant='secondary' onClick={onClose}>
              {textCancel || t('common.actions.cancel')}
            </FISButton>
            <FISButton onClick={onSave}>{textSave || t('common.actions.save')}</FISButton>
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

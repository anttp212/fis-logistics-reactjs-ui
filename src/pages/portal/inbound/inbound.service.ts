import axios from 'axios'
import { config } from '@utils/config'
import { API_ENDPOINTS } from '@constants/Api'
import type { InboundRegistrationRequestI } from './inbound.api'

export const submitInboundRegistration = async (data: InboundRegistrationRequestI) => {
  const response = await axios.post(`${config.apiUrl}${API_ENDPOINTS.portal.inboundRegistration}`, data, {
    timeout: config.apiTimeout
  })
  return response.data
}

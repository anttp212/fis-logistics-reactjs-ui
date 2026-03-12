import React, { useMemo } from 'react'
import type { UploadFile } from 'antd'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import axios from 'axios'
import { API_DEFAULTS, API_ENDPOINTS } from '@constants/Api'

const { Dragger } = Upload

/** Attachment item trả về từ API */
export interface AttachmentItemI {
  contentType?: string
  name?: string | null
  path: string
  size?: number
}

/** Định dạng file cho phép khi acceptOnlyDocuments = true */
const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'] as const

const DOCUMENT_ACCEPT = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf'

function getFileExtension(name: string): string {
  const last = name.split('.').pop()
  return last ? last.toLowerCase() : ''
}

interface PropsI {
  value?: string[]
  onChange?: (paths: string[]) => void
  /** Danh sách file từ API (để hiển thị name, size); value sẽ là các path tương ứng */
  initialFileList?: AttachmentItemI[]
  /** Chỉ cho phép tải lên: doc, docx, xls, xlsx, ppt, pptx, txt, pdf */
  acceptOnlyDocuments?: boolean
}

/** Chuyển attachment từ API sang UploadFile của Ant Design */
function toAntdFileList(paths: string[], initialFileList?: AttachmentItemI[]): UploadFile[] {
  return paths.map((path) => {
    const fromApi = initialFileList?.find((f) => f.path === path)
    const name = fromApi?.name ?? path.split('/').pop() ?? path
    return {
      uid: path,
      name,
      status: 'done' as const,
      size: fromApi?.size,
      type: fromApi?.contentType
    }
  })
}

const UploadMinio: React.FC<PropsI> = ({ value = [], onChange, initialFileList, acceptOnlyDocuments = false }) => {
  const fileList = useMemo(() => toAntdFileList(value, initialFileList), [value, initialFileList])

  const validateFile = (file: File): boolean => {
    if (!acceptOnlyDocuments) return true
    const ext = getFileExtension(file.name)
    if (!DOCUMENT_EXTENSIONS.includes(ext as any)) {
      message.error(`Chỉ chấp nhận file: ${DOCUMENT_EXTENSIONS.join(', ')}. File "${file.name}" không hợp lệ.`)
      return false
    }
    return true
  }

  const uploadFile = async (file: File) => {
    try {
      // (1) lấy presigned url
      const res = await axios.get(`${API_DEFAULTS.baseUrl}${API_ENDPOINTS.files.presignedUploadUrl}`, {
        params: { fileName: file.name }
      })

      const { minioUploadEndpoint, path } = res.data.data

      // (2) upload file lên minio
      await axios.put(minioUploadEndpoint, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        }
      })

      return path
    } catch (err) {
      message.error('Upload file failed')
      throw err
    }
  }

  const props = {
    multiple: true,
    fileList,
    accept: acceptOnlyDocuments ? DOCUMENT_ACCEPT : undefined,
    beforeUpload: (file: File) => {
      if (!validateFile(file)) return Upload.LIST_IGNORE
      return true
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        if (!validateFile(file as File)) {
          onError(new Error('Invalid file type'))
          return
        }
        const path = await uploadFile(file)

        const newList = [...value, path]
        onChange?.(newList)

        onSuccess('ok')
      } catch (err) {
        onError(err)
      }
    },
    onRemove: (file: UploadFile) => {
      const path = file.uid
      onChange?.(value.filter((p) => p !== path))
    },
    onDrop(_e: React.DragEvent<HTMLDivElement>) {}
  }

  return (
    <Dragger {...props}>
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>

      <p className='ant-upload-text'>Nhấn hoặc kéo thả file để tải lên</p>

      <p className='ant-upload-hint'>
        {acceptOnlyDocuments
          ? `Chỉ chấp nhận: ${DOCUMENT_EXTENSIONS.join(', ')}`
          : 'Hỗ trợ tải lên nhiều file cùng lúc'}
      </p>
    </Dragger>
  )
}

export default UploadMinio

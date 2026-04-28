import React, { useMemo, useState } from 'react'
import type { UploadFile } from 'antd'
import { Upload, message, Spin, Modal } from 'antd'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
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

/** Định dạng file văn bản cho phép */
const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'] as const
/** Định dạng file ảnh cho phép */
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'] as const

const DOCUMENT_ACCEPT = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf'
const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg'
const DOCUMENT_AND_IMAGE_ACCEPT = `${DOCUMENT_ACCEPT},${IMAGE_ACCEPT}`

function getFileExtension(name: string): string {
  const last = name.split('.').pop()
  return last ? last.toLowerCase() : ''
}

function isImageFile(name: string, contentType?: string): boolean {
  if (contentType && contentType.startsWith('image/')) return true
  return IMAGE_EXTENSIONS.includes(getFileExtension(name) as any)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

interface PropsI {
  value?: string[]
  onChange?: (paths: string[]) => void
  /** Danh sách file từ API (để hiển thị name, size); value sẽ là các path tương ứng */
  initialFileList?: AttachmentItemI[]
  /** Chỉ cho phép tải lên: doc, docx, xls, xlsx, ppt, pptx, txt, pdf, ảnh (jpg, jpeg, png, ...) */
  acceptOnlyDocuments?: boolean
  /** Chế độ chỉ xem (chỉ hiển thị danh sách + cho phép download), không cho upload/xóa */
  readOnly?: boolean
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

interface UploadingFileI {
  uid: string
  name: string
  size: number
  type: string
  percent: number
}

const UploadMinio: React.FC<PropsI> = ({
  value = [],
  onChange,
  initialFileList,
  acceptOnlyDocuments = false,
  readOnly = false
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFileI[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewTitle, setPreviewTitle] = useState<string>('')
  const isUploading = uploadingFiles.length > 0

  const fileList = useMemo<UploadFile[]>(() => {
    const completed = toAntdFileList(value, initialFileList)
    const inProgress: UploadFile[] = uploadingFiles.map((f) => ({
      uid: f.uid,
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'uploading' as const,
      percent: f.percent
    }))
    return [...completed, ...inProgress]
  }, [value, initialFileList, uploadingFiles])

  const validateFile = (file: File): boolean => {
    if (!acceptOnlyDocuments) return true
    const ext = getFileExtension(file.name)
    const allowed = [...DOCUMENT_EXTENSIONS, ...IMAGE_EXTENSIONS]
    if (!allowed.includes(ext as any)) {
      message.error(`Chỉ chấp nhận file: ${allowed.join(', ')}. File "${file.name}" không hợp lệ.`)
      return false
    }
    return true
  }

  const uploadFile = async (file: File, uid: string) => {
    try {
      const res = await axios.get(`${API_DEFAULTS.baseUrl}${API_ENDPOINTS.files.presignedUploadUrl}`, {
        params: { fileName: file.name }
      })

      const { minioUploadEndpoint, path } = res.data.data

      await axios.put(minioUploadEndpoint, file, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': file.type || 'application/octet-stream'
        },
        onUploadProgress: (e) => {
          const total = e.total ?? file.size
          const percent = total ? Math.round((e.loaded / total) * 100) : 0
          setUploadingFiles((prev) => prev.map((f) => (f.uid === uid ? { ...f, percent } : f)))
        }
      })

      return path
    } catch (err) {
      message.error('Upload file failed')
      throw err
    }
  }

  const fetchFileBlob = async (path: string): Promise<Blob> => {
    const res = await axios.get(`${API_DEFAULTS.baseUrl}${API_ENDPOINTS.files.download}`, {
      params: { path },
      responseType: 'blob'
    })
    return res.data as Blob
  }

  const handleDownload = async (file: UploadFile) => {
    const path = file.uid
    try {
      const blob = await fetchFileBlob(path)
      const filename = file.name || path.split('/').pop() || 'file'
      downloadBlob(blob, filename)
    } catch (err) {
      message.error('Tải file thất bại')
    }
  }

  const handlePreview = async (file: UploadFile) => {
    const path = file.uid
    try {
      const blob = await fetchFileBlob(path)
      const url = URL.createObjectURL(blob)
      setPreviewImage(url)
      setPreviewTitle(file.name || path.split('/').pop() || '')
      setPreviewOpen(true)
    } catch (err) {
      message.error('Không thể xem trước file')
    }
  }

  const handleRemove = async (file: UploadFile): Promise<boolean> => {
    const path = file.uid
    try {
      await axios.delete(`${API_DEFAULTS.baseUrl}${API_ENDPOINTS.files.delete}`, {
        params: { path }
      })
      onChange?.(value.filter((p) => p !== path))
      message.success('Xóa file thành công')
      return true
    } catch (err) {
      message.error('Xóa file thất bại')
      return false
    }
  }

  const handlePreviewClose = () => {
    setPreviewOpen(false)
    if (previewImage) {
      setTimeout(() => URL.revokeObjectURL(previewImage), 300)
    }
    setPreviewImage('')
    setPreviewTitle('')
  }

  const props = {
    multiple: true,
    fileList,
    accept: acceptOnlyDocuments ? DOCUMENT_AND_IMAGE_ACCEPT : undefined,
    disabled: readOnly,
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: !readOnly,
      showPreviewIcon: (file: UploadFile) => isImageFile(file.name ?? '', file.type)
    },
    beforeUpload: (file: File) => {
      if (readOnly) return Upload.LIST_IGNORE
      if (!validateFile(file)) return Upload.LIST_IGNORE
      return true
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      const f = file as File & { uid?: string }
      const uid = f.uid ?? `uploading-${Date.now()}-${Math.random()}`
      try {
        if (!validateFile(f)) {
          onError(new Error('Invalid file type'))
          return
        }

        setUploadingFiles((prev) => [...prev, { uid, name: f.name, size: f.size, type: f.type, percent: 0 }])

        const path = await uploadFile(f, uid)

        const newList = [...value, path]
        onChange?.(newList)

        onSuccess('ok')
      } catch (err) {
        onError(err)
      } finally {
        setUploadingFiles((prev) => prev.filter((u) => u.uid !== uid))
      }
    },
    onDownload: handleDownload,
    onPreview: handlePreview,
    onRemove: handleRemove,
    onDrop(_e: React.DragEvent<HTMLDivElement>) {}
  }

  const content = (
    <Spin spinning={isUploading} indicator={<LoadingOutlined spin />} tip='Đang tải lên...'>
      {readOnly ? (
        <Upload {...props}>
          <span />
        </Upload>
      ) : (
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>

          <p className='ant-upload-text'>Nhấn hoặc kéo thả file để tải lên</p>

          <p className='ant-upload-hint'>
            {acceptOnlyDocuments
              ? `Chỉ chấp nhận: ${[...DOCUMENT_EXTENSIONS, ...IMAGE_EXTENSIONS].join(', ')}`
              : 'Hỗ trợ tải lên nhiều file cùng lúc'}
          </p>
        </Dragger>
      )}
    </Spin>
  )

  return (
    <>
      {content}
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewClose} centered>
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default UploadMinio

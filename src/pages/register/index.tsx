import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FISButton } from 'fis-component'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '@constants'

interface RegisterFormDataI {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<RegisterFormDataI>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormDataI) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation
      if (data.password === data.confirmPassword) {
        // Success - redirect to login
        navigate(ROUTES.login, {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
        })
      } else {
        setError('confirmPassword', {
          message: 'Mật khẩu xác nhận không khớp'
        })
      }
    } catch (_error) {
      setError('root', {
        message: 'Có lỗi xảy ra, vui lòng thử lại'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6'>
            <svg className='h-8 w-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đăng ký</h2>
          <p className='text-sm text-gray-600'>Tạo tài khoản mới để bắt đầu</p>
        </div>

        {/* Form */}
        <div className='bg-white shadow-xl rounded-2xl px-8 py-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
                Tên đăng nhập
              </label>
              <input
                {...register('username', {
                  required: 'Tên đăng nhập là bắt buộc',
                  minLength: {
                    value: 3,
                    message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                  }
                })}
                type='text'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập tên đăng nhập'
              />
              {errors.username && <p className='mt-1 text-sm text-red-600'>{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
                type='email'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập email của bạn'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu
              </label>
              <input
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
                type='password'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập mật khẩu'
              />
              {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Xác nhận mật khẩu
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Xác nhận mật khẩu là bắt buộc',
                  validate: (value) => value === password || 'Mật khẩu xác nhận không khớp'
                })}
                type='password'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập lại mật khẩu'
              />
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-red-800'>{errors.root.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <FISButton type='submit' size='lg' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang đăng ký...
                  </div>
                ) : (
                  'Đăng ký'
                )}
              </FISButton>
            </div>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Đã có tài khoản?{' '}
              <Link to={ROUTES.login} className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

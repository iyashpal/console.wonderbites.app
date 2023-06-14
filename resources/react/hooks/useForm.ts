import { useState } from "react";
import { Axios } from "@/helpers";
import { ErrorsType } from "@/contracts";
import { AxiosRequestConfig } from "axios";

export default function useForm<T>(initialState: T = {} as T) {
  const [form, setForm] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<ErrorsType<T>>({} as ErrorsType<T>)

  /**
   * Handle the on change event for input fields.
   *
   * @param field string
   * @returns {Function}
   */
  function onChange(field: keyof T) {
    return (event) => {
      setForm(data => ({ ...data, [field]: event.target.files instanceof FileList ? event.target.files[0] : event.target.value }))
    }
  }

  /**
  * Synchronize the whole form data.
  *
  * @param data {Object}
  * @returns void
  */
  const sync = (data: T): void => setForm(data)

  const resetForm = (): void => setForm(initialState)

  /**
  * Reset the form errors.
  *
  * @returns void
  */
  const resetErrors = (): void => setErrors({} as ErrorsType<T>)

  /**
  * Get the form error.
  *
  * @param key string
  * @returns string | undefined
  */
  const error = (key: keyof T): undefined | string => errors[key]

  /**
  * Set a value to form input.
  *
  * @param key string
  * @param value any
  */
  function set<V>(key: keyof T, value: V) {
    setForm(e => ({ ...e, [key]: value }))
  }

  /**
   * Get value by key.
   *
   * @param key string
   * @param defaults any
   * @returns any
   */
  function value<V>(key: keyof T, defaults: V = null as V) {
    return form[key] ?? defaults
  }

  /**
   * Convert the object to form data.
   *
   * @returns {FormData}
   */
  function objectToFormData(data: T) {
    let formData = new FormData()

    for (let key in data) {
      let value = data[key]
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString())
        } else if (value instanceof File) {
          formData.append(key, value, value.name)
        } else if (value instanceof Blob) {
          formData.append(key, value)
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0')
        } else if (typeof value === 'string') {
          formData.append(key, value)
        } else if (typeof value === 'number') {
          formData.append(key, `${value}`)
        } else if (value === null || value === undefined) {
          formData.append(key, '')
        }
      }
    }

    return formData
  }

  /**
   * Handle the form request.
   *
   * @param config AxiosRequestConfig<any>
   * @returns Promise
   */
  function request(config: AxiosRequestConfig<any>) {
    resetErrors()
    setIsProcessing(true)
    return Axios().request(config).then(response => {
      setIsProcessing(false)
      return Promise.resolve(response)
    }).catch(error => {
      setIsProcessing(false)
      setErrors(error.response.data?.errors ?? {})
      return Promise.reject(error)
    })
  }

  return {

    sync,

    set,

    value,

    onChange,

    input: form,

    isProcessing,

    errors: error,

    /**
     * Handle the form get request.
     *
     * @param url string
     * @param config AxiosRequestConfig<any>
     * @returns Promise
     */
    get: (url: string, config?: AxiosRequestConfig<any>) => {
      return request({ url, method: 'get', ...config })
    },

    /**
     * Handle the form put request.
     *
     * @param url string
     * @param config AxiosRequestConfig<any>
     * @returns Promise
     */
    put: (url: string, config?: AxiosRequestConfig<any>) => {
      return request({ url, method: 'put', data: objectToFormData(form), ...config })
    },

    /**
     * Handle the form post request.
     *
     * @param url string
     * @param config AxiosRequestConfig<any>
     * @returns Promise
     */
    post: (url: string, config?: AxiosRequestConfig<any>) => {
      return request({ url, method: 'post', data: objectToFormData(form), ...config })
    },

    /**
     * Handle the form patch request.
     *
     * @param url string
     * @param config AxiosRequestConfig<any>
     * @returns Promise
     */
    patch: (url: string, config?: AxiosRequestConfig<any>) => {
      return request({ url, method: 'patch', data: objectToFormData(form), ...config })
    },

    /**
     * Handle the form delete request.
     *
     * @param url string
     * @param config AxiosRequestConfig<any>
     * @returns Promise
     */
    delete: (url: string, config?: AxiosRequestConfig<any>) => {
      return request({ url, method: 'delete', ...config })
    },

    reset: () => {
      resetForm()
      resetErrors()
    },
  }
}

import {Axios} from '@/helpers'
import {useEffect, useState} from 'react'

export default function useDataLoader<T>(url: string, config = {}) {
  const [data, setData] = useState<T>({} as T)
  const [isProcessed, setIsProcessed] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    sync()
  }, [])

  function sync(options = {}) {
    setIsProcessing(true)
    return Axios()
      .get(url, {...config, ...options})
      .then(handleSuccess)
      .catch(handleError)
      .finally(handleComplete)
  }

  function handleSuccess(axiosResponse) {
    setData(axiosResponse.data)
    return Promise.resolve(axiosResponse)
  }

  function handleError(axiosError) {
    return Promise.reject(axiosError)
  }

  function handleComplete() {
    setIsProcessed(true)
    setIsProcessing(false)
  }

  return {
    sync,
    response: data,
    isProcessed: () => isProcessed,
    isProcessing: () => isProcessing,
  }
}

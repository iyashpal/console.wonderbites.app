import {Axios} from '@/helpers'
import {useEffect, useState} from 'react'

export default function useDataLoader<T>(url: string, config = {}) {
  const [data, setData] = useState<T>({} as T)
  const [isFailed, setIsFailed] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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
    setIsFailed(true)
    return Promise.reject(axiosError)
  }

  function handleComplete() {
    setIsProcessed(true)
    setIsProcessing(false)
  }

  return {
    sync,
    response: data,
    isProcessing: () => isProcessing,
    isProcessed: () => isProcessed && !isFailed,
  }
}

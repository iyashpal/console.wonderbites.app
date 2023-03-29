import {useState} from 'react'
import {Axios} from '@/helpers'
import {Product} from '@/types/models'
import {useNavigate} from 'react-router-dom'

export default function useMediaProductForm(fields: FormFields) {
  const navigateTo = useNavigate()
  const [form, setForm] = useState<FormFields>(fields)
  const [product, setProduct] = useState({} as Product)
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  const [attachment, setAttachment] = useState<string | Blob>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  function sync(product: Product) {
    setProduct(product)
    return this
  }

  function onChangeAttachment(e) {
    setAttachment(e.target.files[0])
    setForm(payload => ({...payload, attachment: e.target.value}))
  }

  function generateFormData() {
    let formData = new FormData()

    formData.append('product_id', product.id.toString())

    for (let key in form) {
      switch (key) {
        case 'attachment':
          formData.append('attachment', attachment, form[key])
          break
        default:
          formData.append(key, form[key])
          break
      }
    }

    return formData
  }

  function onChangeCreate() {
    let formData = new FormData()
    formData.append('product_id', product.id.toString())
    formData.append('order', ((product.media?.length ?? 0) + 1).toString())
    formData.append('attachment', attachment, form['attachment'])

    return Axios().post('ingredients', formData).then((data) => {
      setIsProcessing(false)
      return Promise.resolve(data)
    }).catch((error) => {
      setIsProcessing(false)
      setErrors(error.response?.data?.errors ?? {})
      return Promise.reject(error)
    })
  }

  function handleCreate(e) {
    e.preventDefault()
    setIsProcessing(true)

    Axios().post('ingredients', generateFormData()).then(() => {
      setIsProcessing(false)
      navigateTo('/app/ingredients')
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function handleUpdate(e) {
    e.preventDefault()
    setIsProcessing(true)

    Axios().put(`ingredients/${form.id}`, generateFormData()).then(() => {
      setIsProcessing(false)
      navigateTo('/app/ingredients')
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })
  }


  return {
    errors,
    sync,
    data: form,
    isProcessing,
    input: {
      set(key: string, value: any) {
        setForm(e => ({...e, [key]: value}))
      },
      value(key) {
        return form[key]
      },
      onChange: {
        attachment: onChangeAttachment,
        create: onChangeCreate
      },
    },

    onSubmit: {
      create: handleCreate,
      update: handleUpdate,
    }
  }
}


type FormFields = {
  id?: number,
  attachment?: any
}
type FormErrors = {
  attachment: string
}

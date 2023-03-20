import {useState} from 'react'
import {useFetch} from '@/hooks'
import {useNavigate} from 'react-router-dom'

export default function useIngredientForm(fields: IngredientForm) {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [form, setForm] = useState<IngredientForm>(fields)
  const [thumbnail, setThumbnail] = useState<string | Blob>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errors, setErrors] = useState<IngredientFormErrors>({} as IngredientFormErrors)

  function handleCreate(e) {
    e.preventDefault()
    setIsProcessing(true)

    fetcher.post('ingredients', generateFormData()).then(() => {
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

    fetcher.put(`ingredients/${form.id}`, generateFormData()).then(() => {
      setIsProcessing(false)
      navigateTo('/app/ingredients')
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function generateFormData() {
    let formData = new FormData()

    for (let key in form) {
      if (key === 'thumbnail' && form[key]) {
        formData.append('thumbnail', thumbnail, form[key])
        continue
      }

      if (form[key]) {
        formData.append(key, form[key])
      }
    }

    return formData
  }

  function onChangeName(e) {
    setForm(payload => ({...payload, name: e.target.value}))
  }

  function onChangeDescription(e) {
    setForm(payload => ({...payload, description: e.target.value}))
  }

  function onChangeCategoryID(e) {
    setForm(payload => ({...payload, categoryId: e.target.value}))
  }

  function onChangePrice(e) {
    setForm(payload => ({...payload, price: e.target.value}))
  }

  function onChangeUnit(e) {
    setForm(payload => ({...payload, unit: e.target.value}))
  }

  function onChangeQuantity(e) {
    setForm(payload => ({...payload, quantity: e.target.value, minQuantity: e.target.value}))
  }

  function onChangeMinQuantity(e) {
    setForm(payload => ({...payload, minQuantity: e.target.value}))
  }

  function onChangeMaxQuantity(e) {
    setForm(payload => ({...payload, maxQuantity: e.target.value}))
  }


  function onChangeThumbnail(e) {
    setThumbnail(e.target.files[0])
    setForm(payload => ({...payload, thumbnail: e.target.value}))
  }

  function onChangePublishedAt(e) {
    setForm(payload => ({...payload, publishedAt: e.target.value}))
  }


  return {
    errors,
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
        name: onChangeName,
        description: onChangeDescription,
        categoryId: onChangeCategoryID,
        price: onChangePrice,
        unit: onChangeUnit,
        quantity: onChangeQuantity,
        minQuantity: onChangeMinQuantity,
        maxQuantity: onChangeMaxQuantity,
        thumbnail: onChangeThumbnail,
        publishedAt: onChangePublishedAt
      },
    },

    onSubmit: {
      create: handleCreate,
      update: handleUpdate,
    }
  }
}

type IngredientForm = {
  id?: number,
  categoryId: number,
  name: string,
  description: string,
  price: number,
  unit: string,
  quantity: number,
  minQuantity: number,
  maxQuantity: number,
  thumbnail: any,
  publishedAt: string,
}
type IngredientFormErrors = {
  categoryId: string,
  name: string,
  description: string,
  price: string,
  unit: string,
  quantity: string,
  minQuantity: string,
  maxQuantity: string,
  thumbnail: string,
  publishedAt: string,
}
import {useState} from "react";
import {useFetch} from "@/hooks";
import {useNavigate} from "react-router-dom";

type CreateIngredientForm = {
  categoryId: number,
  name: string,
  description: string,
  price: number,
  unit: string,
  quantity: number,
  minQuantity: number,
  maxQuantity: number,
  thumbnail: any,
  sku: string,
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
  sku: string,
  publishedAt: string,
}
export default function useCreateIngredient() {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [thumbnail, setThumbnail] = useState<string | Blob>('')
  const [errors, setErrors] = useState<IngredientFormErrors>({} as IngredientFormErrors)
  const [createForm, setCreateForm] = useState<CreateIngredientForm>({} as CreateIngredientForm)


  function handleSubmit(e) {
    e.preventDefault()
    setIsProcessing(true)
    let createFormData = new FormData()

    for (let key in createForm) {
      if (key === 'thumbnail') {
        createFormData.append('thumbnail', thumbnail, createForm[key])
        continue
      }

      if (createForm[key]) {
        createFormData.append(key, createForm[key])
      }
    }
    fetcher.post('ingredients', createFormData).then(() => {
      alert('Success')
      setIsProcessing(false)
      navigateTo('/app/ingredients')
    }).catch(({data}) => {
      setIsProcessing(false)
      setErrors(data?.errors)
    })
  }

  function onChangeName(e) {
    setCreateForm(payload => ({...payload, name: e.target.value}))
  }

  function onChangeDescription(e) {
    setCreateForm(payload => ({...payload, description: e.target.value}))
  }

  function onChangeCategoryID(e) {
    setCreateForm(payload => ({...payload, categoryId: e.target.value}))
  }

  function onChangePrice(e) {
    setCreateForm(payload => ({...payload, price: e.target.value}))
  }

  function onChangeUnit(e) {
    setCreateForm(payload => ({...payload, unit: e.target.value}))
  }

  function onChangeQuantity(e) {
    setCreateForm(payload => ({...payload, quantity: e.target.value, minQuantity: e.target.value}))
  }

  function onChangeMinQuantity(e) {
    setCreateForm(payload => ({...payload, minQuantity: e.target.value}))
  }

  function onChangeMaxQuantity(e) {
    setCreateForm(payload => ({...payload, maxQuantity: e.target.value}))
  }


  function onChangeThumbnail(e) {
    setThumbnail(e.target.files[0])
    setCreateForm(payload => ({...payload, thumbnail: e.target.value}))
  }

  function onChangePublishedAt(e) {
    setCreateForm(payload => ({...payload, publishedAt: e.target.value}))
  }


  return {
    errors,
    data: createForm,
    isProcessing,
    input: {
      value(key) {
        return createForm[key]
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

    onSubmit: handleSubmit
  }
}

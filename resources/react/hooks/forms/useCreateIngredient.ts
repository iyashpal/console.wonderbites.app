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
  name?: string,
  sku?: string,
  categoryId?: string,
  price?: string,
  description?: string,
  publishedAt?: string,
}
export default function useCreateIngredient() {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [errors, setErrors] = useState<IngredientFormErrors>({} as IngredientFormErrors)
  const [createForm, setCreateForm] = useState<CreateIngredientForm>({} as CreateIngredientForm)

  function handleSubmit(e) {
    e.preventDefault()
    fetcher.post('products', createForm).then(() => {
      alert('Success')
      navigateTo('/app/products')
    }).catch(({data}) => {
      setErrors(data?.errors)
    })
  }

  function onChangeName(e) {
    setCreateForm(payload => ({...payload, name: e.target.value}))
  }

  function onChangeID(e) {
    setCreateForm(payload => ({...payload, sku: e.target.value}))
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
    setCreateForm(payload => ({...payload, thumbnail: e.target.value}))
  }

  function onChangePublishedAt(e) {
    setCreateForm(payload => ({...payload, publishedAt: e.target.value}))
  }


  return {
    errors,
    data: createForm,
    input: {
      value(key) {
        return createForm[key]
      },
      onChange: {
        id: onChangeID,
        name: onChangeName,
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

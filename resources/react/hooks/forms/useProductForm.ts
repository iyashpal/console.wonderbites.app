import {DateTime} from "luxon";
import {Axios} from "~/helpers";
import { useFlash} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

export default function useProductForm(fields: FormFields) {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [createForm, setCreateForm] = useState<FormFields>(fields)
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  const [thumbnail, setThumbnail] = useState<File>()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  /**
   * Event handler for the name field.
   * @param event
   */
  function onChangeName(event: ChangeEvent<HTMLInputElement>) {
    setCreateForm(payload => ({...payload, name: event.target.value}))
  }

  /**
   * Event handler for the description field.
   * @param event
   */
  function onChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
    setCreateForm(payload => ({...payload, description: event.target.value}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeCategoryId(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, categoryId: Number(event.target.value)}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeSku(event: ChangeEvent<HTMLInputElement>) {
    setCreateForm(payload => ({...payload, sku: event.target.value}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeStatus(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, status: event.target.value}))
  }

  /**
   * Event handler for the customization field.
   * @param event
   */
  function onChangeIsCustomizable(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, isCustomizable: Number(event.target.value) === 1}))
  }

  /**
   * Event handler for the customization field.
   * @param event
   */
  function onChangeIsPopular(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, isPopular: Number(event.target.value) === 1}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangePrice(event: ChangeEvent<HTMLInputElement>) {
    setCreateForm(payload => ({...payload, price: Number(event.target.value)}))
  }


  /**
   * Event handler for the calories field.
   * @param event
   */
  function onChangeCalories(event: ChangeEvent<HTMLInputElement>) {
    setCreateForm(payload => ({...payload, calories: event.target.value}))
  }

  /**
   * Event handler for the product type field.
   * @param event
   */
  function onChangeType(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, type: event.target.value}))
  }


  /**
   * Event handler for the thumbnail field.
   * @param event
   */
  function onChangeThumbnail(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    setThumbnail(event.target.files[0])

    setCreateForm(payload => ({...payload, thumbnail: event.target.value}))
  }

  /**
   * Generate FormData instance.
   *
   * @returns FormData
   */
  function generateFormData() {
    let formData = new FormData()

    for (let key in createForm) {
      if (key === 'thumbnail' && thumbnail) {
        formData.append('thumbnail', thumbnail, thumbnail.name)
      } else {
        formData.append(key, createForm[key])
      }
    }

    return formData
  }


  function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsProcessing(true)
    Axios().put(`products/${createForm?.id}`, generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('product_updated', true)
      navigateTo(`/app/products/${data.id}`)
    }).catch(({response}) => {
      setIsProcessing(false)
      flash.set('product_updated', false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsProcessing(true)

    Axios().post('products', generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('product_created', true)
      navigateTo(`/app/products/${data.id}`)
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })

  }

  return {
    errors,
    isProcessing,
    input: {
      set(key: string, value: any) {
        setCreateForm(e => ({...e, [key]: value}))
      },
      value(key) {
        return createForm[key]
      },
      onChange: {
        sku: onChangeSku,
        name: onChangeName,
        type: onChangeType,
        price: onChangePrice,
        status: onChangeStatus,
        calories: onChangeCalories,
        thumbnail: onChangeThumbnail,
        isPopular: onChangeIsPopular,
        categoryId: onChangeCategoryId,
        description: onChangeDescription,
        isCustomizable: onChangeIsCustomizable,
      },
    },
    onSubmit: {
      create: onCreate,
      update: onUpdate,
    }
  }
}

type FormFields = {
  id?: number,
  isPopular: boolean,
  categoryId: number,
  name: string,
  sku: string,
  calories: string,
  price: number | null,
  description: string,
  type: string,
  isCustomizable: boolean,
  status: string,
  createdAt?: DateTime | string,
  updatedAt?: DateTime | string,
}
type FormErrors = {
  sku: string,
  name: string,
  price: string,
  calories: string,
  isPopular: string,
  thumbnail: string,
  categoryId: string,
  description: string,
  type: string,
  status: string,
}

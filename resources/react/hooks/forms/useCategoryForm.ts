import {useFetch} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";
export default function useCategoryForm(fields: CategoryFormFields) {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [form, setForm] = useState<CategoryFormFields>(fields)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  /**
   * Event handler for the name field.
   * @param event
   */
  function onChangeName(event: ChangeEvent<HTMLInputElement>) {
    setForm(payload => ({...payload, name: event.target.value}))
  }

  /**
   * Event handler for the description field.
   * @param event
   */
  function onChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
    setForm(payload => ({...payload, description: event.target.value}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeParent(event: ChangeEvent<HTMLSelectElement>) {
    let parent = Number(event.target.value)
    setForm(payload => ({...payload, parent: parent > 0 ? parent : null}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeType(event: ChangeEvent<HTMLSelectElement>) {
    setForm(payload => ({...payload, type: event.target.value}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeStatus(event: ChangeEvent<HTMLSelectElement>) {
    setForm(payload => ({...payload, status: Number(event.target.value)}))
  }

  function touchCategoryParent() {
    setForm(payload => ({...payload, parent: Number(payload.parent) > 0 ? Number(payload.parent) : null}))
  }

  function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    touchCategoryParent()
    setIsProcessing(true)
    fetcher.put(`categories/${form?.id}`, form).then(({data}) => {
      setIsProcessing(false)
      navigateTo(`/app/categories/${data.id}`)
    }).catch(({data}) => {
      setIsProcessing(false)
      setErrors(data?.errors)
    })
  }

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    touchCategoryParent()
    setIsProcessing(true)
    fetcher.post('categories', form).then(({data}) => {
      setIsProcessing(false)
      navigateTo(`/app/categories/${data.id}`)
    }).catch(({data}) => {
      setIsProcessing(false)
      setErrors(data?.errors)
    })
  }

  return {
    errors,
    isProcessing,
    input: {
      value(key) {
        return form[key]
      },
      onChange: {
        name: onChangeName,
        type: onChangeType,
        parent: onChangeParent,
        description: onChangeDescription,
        status: onChangeStatus,
      },
    },
    onSubmit: {
      create: onCreate,
      update: onUpdate,
    }
  }
}

type CategoryFormFields = {
  id?: number,
  name: string,
  type: string,
  parent: number | null,
  description: string,
  status: number,
  created_at?: string,
  updated_at?: string,
}
type FormErrors = {
  name: string,
  description: string,
  type: string,
  parent: string,
  status: string,
}

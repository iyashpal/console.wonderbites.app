import {Axios} from "@/helpers";
import {useFlash} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

export default function useCategoryForm(fields: FormFields) {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [form, setForm] = useState<FormFields>(fields)
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  const [thumbnail, setThumbnail] = useState<string | Blob>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

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
    setForm(payload => ({...payload, parent: Number(event.target.value) > 0 ? event.target.value : null}))
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

  /**
   * Event handler for the thumbnail field.
   * @param event
   */
  function onChangeThumbnail(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    setThumbnail(event.target.files[0])

    setForm(payload => ({...payload, thumbnail: event.target.value}))
  }


  /**
   * Generate FormData instance.
   *
   * @returns FormData
   */
  function generateFormData() {
    let formData = new FormData()

    for (let key in form) {
      switch (key) {
        case 'thumbnail':
          formData.append('thumbnail', thumbnail, form[key])
          break
        case 'parent':
          if (form[key])
            formData.append(key, form[key] ?? '')
          break
        default:
          formData.append(key, form[key])
          break
      }
    }

    return formData
  }

  function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    Axios().put(`categories/${form?.id}`, generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('category_updated', true)
      navigateTo(`/app/categories/${data.id}`)
      setErrors({} as FormErrors)
    }).catch(({response}) => {
      setIsProcessing(false)
      flash.set('category_updated', false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    Axios().post('categories', generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('category_created', true)
      navigateTo(`/app/categories/${data.id}`)
      setErrors({} as FormErrors)
    }).catch(({response}) => {
      setIsProcessing(false)
      flash.set('category_created', false)
      setErrors(response?.data?.errors ?? {})
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
        status: onChangeStatus,
        thumbnail: onChangeThumbnail,
        description: onChangeDescription,
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
  name: string,
  type: string,
  parent: string | null,
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
  thumbnail: string,
}

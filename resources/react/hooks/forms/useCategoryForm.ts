import {Axios} from "@/helpers";
import {useFlash} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

export default function useCategoryForm(fields: FormFields) {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [form, setForm] = useState<FormFields>(fields)
  const [thumbnail, setThumbnail] = useState<File>()
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
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
    setForm(payload => ({...payload, status: event.target.value}))
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
      if (key === 'thumbnail' && thumbnail) {
        formData.append('thumbnail', thumbnail, thumbnail.name)
      } else if (key === 'parent' && form[key]) {
        formData.append(key, form[key] ?? '')
      } else {
        formData.append(key, form[key])
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
      set(key: string, value: any) {
        setForm(e => ({...e, [key]: value}))
      },
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
  status: string,
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

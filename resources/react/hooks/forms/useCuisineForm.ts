import {Axios} from "@/helpers";
import {useFlash} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

export default function useCuisineForm(fields: FormFields) {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [form, setForm] = useState<FormFields>(fields)
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  const [thumbnail, setThumbnail] = useState<File>()
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
      if (key === 'thumbnail' && thumbnail) {
        formData.append('thumbnail', thumbnail, thumbnail.name)
      } else {
        formData.append(key, form[key])
      }
    }

    return formData
  }


  function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsProcessing(true)
    Axios().put(`cuisines/${form?.id}`, generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('cuisines_updated', true)
      navigateTo(`/app/cuisines/${data.id}`)
    }).catch(({response}) => {
      setIsProcessing(false)
      flash.set('cuisine_updated', false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsProcessing(true)

    Axios().post('cuisines', generateFormData()).then(({data}) => {
      setIsProcessing(false)
      flash.set('cuisine_created', true)
      navigateTo(`/app/cuisines/${data.id}`)
    }).catch(({response}) => {
      setIsProcessing(false)
      flash.set('cuisine_created', false)
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
        thumbnail: onChangeThumbnail,
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

type FormFields = {
  id?: number,
  name: string,
  description: string,
  thumbnail?: string,
  status: number,
}
type FormErrors = {
  name: string,
  description: string,
  thumbnail: string,
  status: string,
}

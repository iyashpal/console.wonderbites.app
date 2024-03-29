import {Axios} from "@/helpers";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

export default function useCategoryForm(fields: FormFields) {
  const navigateTo = useNavigate()
  const [form, setForm] = useState<FormFields>(fields)
  const [attachment, setAttachment] = useState<File>()
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  /**
   * Event handler for the name field.
   * @param event
   */
  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setForm(payload => ({...payload, title: event.target.value}))
  }

  function onChangePage(event: ChangeEvent<HTMLSelectElement>) {
    setForm(payload => ({...payload, options: {...payload.options, page: event.target.value}}))
  }
  function onChangeSection(event: ChangeEvent<HTMLSelectElement>) {
    setForm(payload => ({...payload, options: {...payload.options, section: event.target.value}}))
  }

  function onChangeLink(event: ChangeEvent<HTMLInputElement>) {
    setForm(payload => ({...payload, options: {...payload.options, link: event.target.value}}))
  }

  /**
   * Event handler for the status field.
   * @param event
   */
  function onChangeType(event: ChangeEvent<HTMLSelectElement>) {
    setForm(payload => ({...payload, options: {...payload.options, type: event.target.value}}))
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
  function onChangeAttachment(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    setAttachment(event.target.files[0])

    setForm(payload => ({...payload, attachment: event.target.value}))
  }


  /**
   * Generate FormData instance.
   *
   * @returns FormData
   */
  function generateFormData() {
    let formData = new FormData()

    for (let key in form) {
      if (key === 'attachment' && attachment) {
        formData.append('attachment', attachment, attachment.name)
      } else if (key === 'options') {
        formData.append('options[page]', form.options.page)
        formData.append('options[type]', form.options.type)
        formData.append('options[link]', form.options.link)
        formData.append('options[section]', form.options.section)
      } else {
        formData.append(key, form[key])
      }
    }

    return formData
  }

  function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    Axios().put(`banners/${form?.id}`, generateFormData()).then(({data}) => {
      setIsProcessing(false)
      navigateTo(`/app/banners/${data.id}`)
      setErrors({} as FormErrors)
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })
  }

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    Axios().post('banners', generateFormData()).then(({data}) => {
      setIsProcessing(false)
      navigateTo(`/app/banners/${data.id}`)
      setErrors({} as FormErrors)
    }).catch(({response}) => {
      setIsProcessing(false)
      setErrors(response?.data?.errors ?? {})
    })
  }


  return {
    errors,
    isProcessing,
    form,
    input: {
      set(key: string, value: any) {
        setForm(e => ({...e, [key]: value}))
      },
      value(key) {
        return form[key]
      },
      onChange: {
        title: onChangeTitle,
        status: onChangeStatus,
        options: {
          page: onChangePage,
          type: onChangeType,
          link: onChangeLink,
          section: onChangeSection,
        },
        attachment: onChangeAttachment,
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
  user_id?: number,
  title: string,
  options: {
    page: string,
    section: string,
    type: string,
    link: string,
  },
  status: string,
  created_at?: string,
  updated_at?: string,
}
type FormErrors = {
  name: string,
  user_id: string,
  title: string,
  description: string,
  attachment: string,
  status: string,
}

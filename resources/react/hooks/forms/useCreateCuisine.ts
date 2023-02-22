import {useFetch} from "@/hooks";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";

type CreateCuisineForm = {
  name: string,
  description: string,
  thumbnail: any,
  status: number,
}
type CuisineFormErrors = {
  name: string,
  description: string,
  thumbnail: string,
  status: string,
}

export default function useCreateCuisine() {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [thumbnail, setThumbnail] = useState<string | Blob>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errors, setErrors] = useState<CuisineFormErrors>({} as CuisineFormErrors)
  const [createForm, setCreateForm] = useState<CreateCuisineForm>({name: '', description: '', status: 1} as CreateCuisineForm)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsProcessing(true)

    let createFormData = new FormData()

    for (let key in createForm) {
      if (key === 'thumbnail') {
        createFormData.append('thumbnail', thumbnail, createForm[key])
      } else {
        createFormData.append(key, createForm[key])
      }
    }
    fetcher.post('cuisines', createFormData).then(() => {
      alert('Success')
      setIsProcessing(false)
      navigateTo('/app/cuisines')
    }).catch(({data}) => {
      setIsProcessing(false)
      setErrors(data?.errors)
    })
  }

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
    console.log(event)
    setCreateForm(payload => ({...payload, description: event.target.value}))
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
   * Event handler for the status field.
   * @param event
   */
  function onChangeStatus(event: ChangeEvent<HTMLSelectElement>) {
    setCreateForm(payload => ({...payload, status: Number(event.target.value)}))
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
        status: onChangeStatus,
        thumbnail: onChangeThumbnail,
      },
    },

    onSubmit: handleSubmit
  }
}

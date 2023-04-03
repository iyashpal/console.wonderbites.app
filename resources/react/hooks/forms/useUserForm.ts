import {ChangeEvent, FormEvent, useState} from "react";
import {Axios} from "@/helpers";
import {useNavigate} from "react-router-dom";

export default function useUserForm(fields: FormFields) {
  const navigateTo = useNavigate()
  const [form, setForm] = useState(fields)
  const [errors, setErrors] = useState({} as FormErrors)
  const [avatar, setAvatar] = useState<string | Blob>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  function generateFormData() {
    let formData = new FormData()

    formData.append('avatar', avatar)

    for (let key in form) {
      if (form[key]) {
        formData.append(key, form[key])
      }
    }

    return formData
  }

  return {
    errors,
    isProcessing,
    input: {
      onChange: {
        avatar(event: ChangeEvent<HTMLInputElement>) {
          if (!event.target.files) return;

          setAvatar(event.target.files[0])
        },
        firstName(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, first_name: event.target.value}))
        },
        lastName(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, last_name: event.target.value}))
        },
        email(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, email: event.target.value}))
        },
        phone(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, phone: event.target.value}))
        },
        password(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, password: event.target.value}))
        },
        passwordConfirmation(event: ChangeEvent<HTMLInputElement>) {
          setForm(data => ({...data, password_confirmation: event.target.value}))
        },
      }
    },
    onSubmit: {
      create(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsProcessing(true)
        Axios().post(`users`, generateFormData()).then(({data}) => {
          setIsProcessing(false)
          setErrors({} as FormErrors)
          navigateTo(`/app/users/${data.id}`)
        }).catch(({response}) => {
          setIsProcessing(false)
          setErrors(response?.data?.errors)
        })
      },
      update(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsProcessing(true)
        Axios().put(`users/${form.id}`, generateFormData()).then(({data}) => {
          setIsProcessing(false)
          setErrors({} as FormErrors)
          navigateTo(`/app/users/${data.id}`)
        }).catch(({response}) => {
          setIsProcessing(false)
          setErrors(response?.data?.errors)
        })
      },
    }
  }
}

type FormFields = {
  id?: number,
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone: string,
  password_confirmation: string
}

type FormErrors = {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone: string,
  password_confirmation: string,
  avatar: string,
}

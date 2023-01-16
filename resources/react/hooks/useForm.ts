import {useState} from "react";

export default function useForm<T>(fields) {

  const [formFields] = useState(fields)

  const [errors] = useState<T>({} as T)

  return {
    errors,
    fields: formFields,
  }
}

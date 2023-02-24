import {DateTime} from "luxon";
import {useDispatch, useSelector} from "@/store/hooks";
import * as flashActions from '@/store/features/page/flashSlice'

export default function useFlash() {
  const dispatch = useDispatch()
  const flash = useSelector(state => state.flashSlice)

  function set(key: string, value: any) {
    dispatch(flashActions.setFlash({key: key, value: value, timeline: DateTime.now().toString()}))
  }

  function isValidFlash(key: string) {
    if (flash.timeline[key]) {
      let diff = DateTime.now().diff(DateTime.fromISO(flash.timeline[key]), ['minutes'])

      return diff.get('seconds') <= 60
    }

    return false
  }

  function reset(key: string) {
    let value = flash.messages[key]

    dispatch(flashActions.resetFlash(key))

    return value
  }

  function get(key) {
    if (isValidFlash(key)) {

      return flash.messages[key]
    }

    return null
  }

  return {set, get, reset}
}

import { RootState, StoreDispatch } from "@/store";
import { TypedUseSelectorHook, useDispatch as useStoreDispatch, useSelector as useStoreSelector } from "react-redux";

export const useDispatch = () => useStoreDispatch<StoreDispatch>()

export const useSelector: TypedUseSelectorHook<RootState> = useStoreSelector

import { NotificationsProvider } from "@/providers";
import { Outlet } from "react-router-dom";
import AxiosErrors from "./AxiosErrors";

export default function Root() {
    return <>
        <AxiosErrors>
            <Outlet />
        </AxiosErrors>
        <NotificationsProvider />
    </>
}

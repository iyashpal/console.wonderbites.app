import {
    CheckCircleIcon, CancelIcon, CommentIcon, CloseIcon,
    MenuIcon,
    NotificationsIcon,
    SpaceDashboardIcon,


} from '@materialicons/vue/round'
import MaterialIcons from '@materialicons/vue'

export default {

    install(app) {

        app.use(MaterialIcons, {
            icons: {
                Round: {
                    CancelIcon, CheckCircleIcon, CommentIcon, CloseIcon,
                    MenuIcon,
                    NotificationsIcon,
                    SpaceDashboardIcon,
                }
            }
        })

    }
}

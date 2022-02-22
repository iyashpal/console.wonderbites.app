import {
    CommentIcon, CloseIcon,
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
                    CommentIcon, CloseIcon,
                    MenuIcon,
                    NotificationsIcon,
                    SpaceDashboardIcon,
                }
            }
        })

    }
}

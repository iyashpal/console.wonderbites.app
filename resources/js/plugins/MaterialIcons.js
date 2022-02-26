import {
    AddCircleIcon, ArrowLeftIcon,
    CheckCircleIcon, CancelIcon, CommentIcon, CloseIcon,
    DeleteIcon,
    EditIcon,
    MenuIcon,
    NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
    SpaceDashboardIcon,


} from '@materialicons/vue/round'
import MaterialIcons from '@materialicons/vue'

export default {

    install(app) {

        app.use(MaterialIcons, {
            icons: {
                Round: {
                    AddCircleIcon, ArrowLeftIcon,
                    CancelIcon, CheckCircleIcon, CommentIcon, CloseIcon,
                    DeleteIcon,
                    EditIcon,
                    MenuIcon,
                    NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
                    SpaceDashboardIcon,
                }
            }
        })

    }
}

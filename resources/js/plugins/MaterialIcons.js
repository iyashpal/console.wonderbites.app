import {
    AddCircleIcon, ArrowLeftIcon,
    CheckCircleIcon, CancelIcon, CategoryIcon, CommentIcon, CloseIcon,
    DeleteIcon, DinnerDiningIcon,
    EditIcon,
    GroupIcon,
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
                    CancelIcon, CheckCircleIcon, CategoryIcon, CommentIcon, CloseIcon,
                    DeleteIcon, DinnerDiningIcon,
                    EditIcon,
                    GroupIcon,
                    MenuIcon,
                    NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
                    SpaceDashboardIcon,
                }
            }
        })

    }
}

import {
  AddCircleIcon, ArrowLeftIcon,
  CheckCircleIcon, CancelIcon, CategoryIcon, CommentIcon, CloseIcon,
  DeleteIcon, DinnerDiningIcon,
  EditIcon,
  GroupIcon,
  LocalOfferIcon, LunchDiningIcon,
  MenuIcon, MenuBookIcon, MessageIcon,
  ReviewsIcon,
  ThumbUpAltIcon,
  LocalPizzaIcon,
  NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
  SpaceDashboardIcon,
} from '@materialicons/vue/round'
import MaterialIcons from '@materialicons/vue'

export default {

  install (app) {
    app.use(MaterialIcons, {
      icons: {
        Round: {
          AddCircleIcon, ArrowLeftIcon,
          CancelIcon, CheckCircleIcon, CategoryIcon, CommentIcon, CloseIcon,
          DeleteIcon, DinnerDiningIcon,
          EditIcon,
          GroupIcon,
          LocalOfferIcon, LunchDiningIcon,
          MenuIcon, MenuBookIcon, MessageIcon,
          ReviewsIcon,
          ThumbUpAltIcon,
          NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
          SpaceDashboardIcon,
        },
      },
    })
  },
}

import {
  AddCircleIcon, ArrowLeftIcon,
  CallToActionIcon, CheckCircleIcon, CancelIcon, CategoryIcon, CommentIcon, CloseIcon, CollectionsIcon,
  DeleteIcon, DinnerDiningIcon,
  EditIcon,
  GroupIcon, GroupWorkIcon,
  LocalOfferIcon, LunchDiningIcon, LocalPizzaIcon,
  MenuIcon, MenuBookIcon, MessageIcon,
  PaymentsIcon,
  ReviewsIcon, RssFeedIcon, RateReviewIcon, ReceiptIcon,
  ThumbUpAltIcon,
  NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
  SpaceDashboardIcon, StoreIcon,
} from '@materialicons/vue/round'
import MaterialIcons from '@materialicons/vue'

export default {

  install (app) {
    app.use(MaterialIcons, {
      icons: {
        Round: {
          AddCircleIcon, ArrowLeftIcon,
          CallToActionIcon, CancelIcon, CheckCircleIcon, CategoryIcon, CommentIcon, CloseIcon, CollectionsIcon,
          DeleteIcon, DinnerDiningIcon,
          EditIcon,
          GroupIcon, GroupWorkIcon,
          LocalOfferIcon, LunchDiningIcon, LocalPizzaIcon,
          MenuIcon, MenuBookIcon, MessageIcon,
          PaymentsIcon,
          ReviewsIcon, RssFeedIcon, RateReviewIcon, ReceiptIcon,
          ThumbUpAltIcon,
          NavigateBeforeIcon, NavigateNextIcon, NotificationsIcon,
          SpaceDashboardIcon, StoreIcon,
        },
      },
    })
  },
}

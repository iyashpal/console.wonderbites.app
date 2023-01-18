/**
 * Authentication Views
 */
import Login from '~/views/auth/Login'

/**
 * Dashboard Views
 */
import Dashboard from '~/views/Dashboard'

/**
 * Products Views
 */
import ShowProduct from '~/views/products/ShowProduct'
import ListProducts from '~/views/products/ListProducts'

/**
 * Categories Views
 */
import ShowCategory from '~/views/categories/ShowCategory'
import ListCategories from '~/views/categories/ListCategories'

/**
 * Cuisines Views
 */
import ShowCuisine from '~/views/cuisines/ShowCuisine'
import ListCuisines from '~/views/cuisines/ListCuisines'

/**
 * Banners Views
 */
import ListBanners from '~/views/banners/ListBanners'

/**
 * Chats Views
 */
import ListChats from '~/views/chats/ListChats';

/**
 * Clients Views
 */
import ListClients from '~/views/clients/ListClients';

/**
 * Coupons Views
 */
import ListCoupons from '~/views/coupons/ListCoupons';

/**
 * Feedbacks Views
 */
import ListFeedbacks from '~/views/feedbacks/ListFeedbacks';

/**
 * Ingredients Views
 */
import ListIngredients from '~/views/ingredients/ListIngredients';

/**
 * Orders Views
 */
import ListOrders from '~/views/orders/ListOrders';

/**
 * Pages Views
 */
import ListPages from '~/views/pages/ListPages';

/**
 * Reservations Views
 */
import ListReservations from '~/views/reservations/ListReservations';

/**
 * Reviews Views
 */
import ListReviews from '~/views/reviews/ListReviews';

/**
 * Settings Views
 */
import ListSettings from '~/views/settings/ListSettings';

/**
 * Subscriptions Views
 */
import ListSubscriptions from '~/views/subscriptions/ListSubscriptions';

/**
 * Users Views
 */
import ListUsers from '~/views/users/ListUsers';

/**
 * Wait list Views
 */
import ListWaitList from '~/views/waitlist/ListWaitList';

/**
 * Wonder points Views
 */
import ListWonderPoints from '~/views/wonderpoints/ListWonderPoints';

const Views = {

  Auth: {
    Login
  },

  Banners: {
    List: ListBanners
  },

  Categories: {
    List: ListCategories,
    Show: ShowCategory,
  },

  Chat: {
    List: ListChats
  },

  Clients: {
    List: ListClients
  },

  Coupons: {
    List: ListCoupons
  },

  Cuisines: {
    List: ListCuisines,
    Show: ShowCuisine,
  },

  Dashboard: Dashboard,

  Feedbacks: {
    List: ListFeedbacks
  },

  Ingredients: {
    List: ListIngredients
  },

  Orders: {
    List: ListOrders
  },

  Pages: {
    List: ListPages
  },

  Products: {
    List: ListProducts,
    Show: ShowProduct,
  },

  Reservations: {
    List: ListReservations
  },

  Reviews: {
    List: ListReviews
  },

  Settings: {
    List: ListSettings
  },

  Subscriptions: {
    List: ListSubscriptions
  },

  Users: {
    List: ListUsers
  },

  WaitList: {
    List: ListWaitList
  },

  WonderPoints: {
    List: ListWonderPoints
  }
}

export default Views

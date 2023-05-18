/**
 * Authentication Views
 */
import Login from '~/pages/auth/Login'

/**
 * Dashboard Views
 */
import Dashboard from '~/pages/Dashboard'

/**
 * Products Views
 */
import ShowProduct from '~/pages/products/ShowProduct'
import EditProduct from '~/pages/products/EditProduct'
import ListProducts from '~/pages/products/ListProducts'
import CreateProduct from '~/pages/products/CreateProduct'

/**
 * Categories Views
 */
import ShowCategory from '~/pages/categories/ShowCategory'
import EditCategory from '~/pages/categories/EditCategory'
import CreateCategory from '~/pages/categories/CreateCategory'
import ListCategories from '~/pages/categories/ListCategories'

/**
 * Cuisines Views
 */
import ShowCuisine from '~/pages/cuisines/ShowCuisine'
import ListCuisines from '~/pages/cuisines/ListCuisines'
import EditCuisines from '~/pages/cuisines/EditCuisines'
import CreateCuisines from '~/pages/cuisines/CreateCuisines'

/**
 * Banners Views
 */
import EditBanner from '~/pages/banners/EditBanner'
import ShowBanner from '~/pages/banners/ShowBanner'
import ListBanners from '~/pages/banners/ListBanners'
import CreateBanner from '~/pages/banners/CreateBanner'

/**
 * Chats Views
 */
import ListChats from '~/pages/chats/ListChats';

/**
 * Clients Views
 */
import ListClients from '~/pages/clients/ListClients';

/**
 * Coupons Views
 */
import ListCoupons from '~/pages/coupons/ListCoupons';

/**
 * Feedbacks Views
 */
import ListFeedbacks from '~/pages/feedbacks/ListFeedbacks';

/**
 * Ingredients Views
 */
import ShowIngredient from '~/pages/ingredients/ShowIngredient';
import EditIngredient from '~/pages/ingredients/EditIngredient';
import ListIngredients from '~/pages/ingredients/ListIngredients';
import CreateIngredient from '~/pages/ingredients/CreateIngredient';

/**
 * Orders Views
 */
import ShowOrder from '~/pages/orders/ShowOrder';
import EditOrder from '~/pages/orders/EditOrder';
import ListOrders from '~/pages/orders/ListOrders';
import CreateOrder from '~/pages/orders/CreateOrder';

/**
 * Pages Views
 */
import ListPages from '~/pages/pages/ListPages';

/**
 * Reservations Views
 */
import ListReservations from '~/pages/reservations/ListReservations';

/**
 * Reviews Views
 */
import ListReviews from '~/pages/reviews/ListReviews';

/**
 * Settings Views
 */
import ListSettings from '~/pages/settings/ListSettings';

/**
 * Subscriptions Views
 */
import ListSubscriptions from '~/pages/subscriptions/ListSubscriptions';

/**
 * Users Views
 */
import EditUser from '~/pages/users/EditUser';
import ShowUser from '~/pages/users/ShowUser';
import ListUsers from '~/pages/users/ListUsers';
import CreateUser from '~/pages/users/CreateUser';

/**
 * Wait list Views
 */
import ListWaitList from '~/pages/waitlist/ListWaitList';

/**
 * Wonder points Views
 */
import ListWonderPoints from '~/pages/wonderpoints/ListWonderPoints';


const Views = {

  Auth: {
    Login
  },

  Banners: {
    List: ListBanners,
    Edit: EditBanner,
    Show: ShowBanner,
    Create: CreateBanner,
  },

  Categories: {
    List: ListCategories,
    Create: CreateCategory,
    Show: ShowCategory,
    Edit: EditCategory,
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
    Edit: EditCuisines,
    Create: CreateCuisines,
  },

  Dashboard: Dashboard,

  Feedbacks: {
    List: ListFeedbacks
  },

  Ingredients: {
    Show: ShowIngredient,
    List: ListIngredients,
    Create: CreateIngredient,
    Edit: EditIngredient,
  },

  Orders: {
    Edit: EditOrder,
    Show: ShowOrder,
    List: ListOrders,
    Create: CreateOrder,
  },

  Pages: {
    List: ListPages
  },

  Products: {
    List: ListProducts,
    Show: ShowProduct,
    Edit: EditProduct,
    Create: CreateProduct,
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
    Show: ShowUser,
    Edit: EditUser,
    List: ListUsers,
    Create: CreateUser,
  },

  WaitList: {
    List: ListWaitList
  },

  WonderPoints: {
    List: ListWonderPoints
  }
}

export default Views

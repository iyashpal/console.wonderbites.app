/**
 * Authentication Views
 */
import Login from '~/pages/app/auth/Login'

/**
 * Dashboard Views
 */
import Dashboard from '~/pages/app/Dashboard'

/**
 * Products Views
 */
import ShowProduct from '~/pages/app/products/ShowProduct'
import EditProduct from '~/pages/app/products/EditProduct'
import ListProducts from '~/pages/app/products/ListProducts'
import CreateProduct from '~/pages/app/products/CreateProduct'

/**
 * Categories Views
 */
import ShowCategory from '~/pages/app/categories/ShowCategory'
import EditCategory from '~/pages/app/categories/EditCategory'
import CreateCategory from '~/pages/app/categories/CreateCategory'
import ListCategories from '~/pages/app/categories/ListCategories'

/**
 * Cuisines Views
 */
import ShowCuisine from '~/pages/app/cuisines/ShowCuisine'
import ListCuisines from '~/pages/app/cuisines/ListCuisines'
import EditCuisines from '~/pages/app/cuisines/EditCuisines'
import CreateCuisines from '~/pages/app/cuisines/CreateCuisines'

/**
 * Banners Views
 */
import EditBanner from '~/pages/app/banners/EditBanner'
import ShowBanner from '~/pages/app/banners/ShowBanner'
import ListBanners from '~/pages/app/banners/ListBanners'
import CreateBanner from '~/pages/app/banners/CreateBanner'

/**
 * Chats Views
 */
import ListChats from '~/pages/app/chats/ListChats';

/**
 * Clients Views
 */
import ListClients from '~/pages/app/clients/ListClients';

/**
 * Coupons Views
 */
import ListCoupons from '~/pages/app/coupons/ListCoupons';

/**
 * Feedbacks Views
 */
import ListFeedbacks from '~/pages/app/feedbacks/ListFeedbacks';

/**
 * Ingredients Views
 */
import ShowIngredient from '~/pages/app/ingredients/ShowIngredient';
import EditIngredient from '~/pages/app/ingredients/EditIngredient';
import ListIngredients from '~/pages/app/ingredients/ListIngredients';
import CreateIngredient from '~/pages/app/ingredients/CreateIngredient';

/**
 * Orders Views
 */
import ShowOrder from '~/pages/app/orders/ShowOrder';
import EditOrder from '~/pages/app/orders/EditOrder';
import ListOrders from '~/pages/app/orders/ListOrders';
import CreateOrder from '~/pages/app/orders/CreateOrder';

/**
 * Pages Views
 */
import ListPages from '~/pages/app/pages/ListPages';

/**
 * Reservations Views
 */
import ListReservations from '~/pages/app/reservations/ListReservations';

/**
 * Reviews Views
 */
import ListReviews from '~/pages/app/reviews/ListReviews';

/**
 * Settings Views
 */
import ListSettings from '~/pages/app/settings/ListSettings';

/**
 * Subscriptions Views
 */
import ListSubscriptions from '~/pages/app/subscriptions/ListSubscriptions';

/**
 * Users Views
 */
import EditUser from '~/pages/app/users/EditUser';
import ShowUser from '~/pages/app/users/ShowUser';
import ListUsers from '~/pages/app/users/ListUsers';
import CreateUser from '~/pages/app/users/CreateUser';

/**
 * Wait list Views
 */
import ListWaitList from '~/pages/app/waitlist/ListWaitList';

/**
 * Wonder points Views
 */
import ListWonderPoints from '~/pages/app/wonderpoints/ListWonderPoints';


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

/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
export const { actions } = Bouncer

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({

  'API.User': () => import('App/Policies/API/UserPolicy'),

  AddressPolicy: () => import('App/Policies/AddressPolicy'),
  CartPolicy: () => import('App/Policies/CartPolicy'),
  CategoryPolicy: () => import('App/Policies/CategoryPolicy'),
  CouponPolicy: () => import('App/Policies/CouponPolicy'),
  CuisinePolicy: () => import('App/Policies/CuisinePolicy'),

  ExtraFieldPolicy: () => import('App/Policies/ExtraFieldPolicy'),

  FeedbackPolicy: () => import('App/Policies/FeedbackPolicy'),

  IngredientPolicy: () => import('App/Policies/IngredientPolicy'),

  MediaPolicy: () => import('App/Policies/MediaPolicy'),

  NotificationPolicy: () => import('App/Policies/NotificationPolicy'),

  OrderPolicy: () => import('App/Policies/OrderPolicy'),

  ProductPolicy: () => import('App/Policies/ProductPolicy'),

  ReviewPolicy: () => import('App/Policies/ReviewPolicy'),

  UserPolicy: () => import('App/Policies/UserPolicy'),

  WishlistPolicy: () => import('App/Policies/WishlistPolicy'),
})

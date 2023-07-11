import User from "@/contracts/schema/User";
import {Coupon, Product} from "@/contracts/schema/index";

export default interface Order {
    id: number,
    user_id: number
    coupon_id: number
    token: string
    order_type: string
    payment_mode: string
    first_name: string
    last_name: string
    street: string
    city: string
    phone: string
    email: string
    location: {
        lat?: string
        lng?: string
    }
    reserved_seats: number
    eat_or_pickup_time: number
    data: {
        id: number
        quantity: number
        variant?: {
            id: number
            ingredients: {
                id: number
                quantity: number
                category: number
            }[]
        }
        ingredients?: {
            id: number
            quantity: number
            category: number
        }[]
    }[]

    option: {
        extras: string[]
        delivery_fee: string
    }
    channel: 'web' | 'app' | 'console'
    note: string
    status: string,
    created_at: string,
    updated_at: string

    user?: User
    coupon?: Coupon
    products: Product[]
}

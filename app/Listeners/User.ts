import UserOnBoard from 'App/Mailers/UserOnBoard'
import type { EventsList } from '@ioc:Adonis/Core/Event'

export default class User {
  public async onBoard (user: EventsList['User:OnBoard']) {
    await new UserOnBoard(user).send()
    console.log('On Boarded')
  }
}

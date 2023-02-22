import User from 'App/Models/User'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.updateOrCreateMany('email', [
      {
        firstName: 'Yash',
        roleId: 1,
        lastName: 'Pal',
        mobile: '01234567890',
        email: 'yash@brandsonify.com',
        password: 'secret',
      },
    ])
  }
}

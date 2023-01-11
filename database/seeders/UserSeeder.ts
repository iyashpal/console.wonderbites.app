import User from 'App/Models/User'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.firstOrCreate({ email: 'yash@brandsonify.com' }, {
      firstName: 'Yash',
      lastName: 'Pal',
      mobile: '01234567890',
      password: 'secret',
    })
  }
}

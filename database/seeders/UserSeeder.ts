import User from 'App/Models/User'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.create({
      firstName: 'Yash',
      lastName: 'Pal',
      email: 'iyashpal.92@gmail.com',
      mobile: '01234567890',
      password: 'secret',
    })
  }
}

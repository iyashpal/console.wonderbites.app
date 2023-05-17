import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
  private async runSeeder (Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (Seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  public async run () {
    await this.runSeeder(await import('../RoleSeeder'))
    await this.runSeeder(await import('../UserSeeder'))
    await this.runSeeder(await import('../ProductSeeder'))
    await this.runSeeder(await import('../MediaSeeder'))
    await this.runSeeder(await import('../CategorySeeder'))
    await this.runSeeder(await import('../CuisineSeeder'))
  }
}

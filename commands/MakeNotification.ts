import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakeNotification extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:notification'

  @args.string({ description: 'Name of the notification class' })
  public name: string

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Make a new notification class'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run () {
    const stub = join(__dirname, '..', 'templates', 'app', 'notification.txt')

    const path = this.application.resolveNamespaceDirectory('notifications')

    this.generator.addFile(this.name)
      .stub(stub)
      .useMustache()
      .destinationDir(path || 'app/Notifications')
      .appRoot(this.application.cliCwd || this.application.appRoot)

    await this.generator.run()
  }
}

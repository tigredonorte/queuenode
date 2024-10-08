import { Body, Controller, Post, Route } from 'tsoa';
import { logger } from '../../lib/logger';
import { add } from '../../lib/queue';
import { CreateUserRequest, IUser, UserRole } from '../../types/IUser';

@Route('user')
export class UserController extends Controller {
  /**
   * Create a new user and send a welcome email.
   * @param user The user to create.
   */
  @Post()
  public async create(@Body() user: CreateUserRequest): Promise<IUser> {
    const newUser = {
      ...user,
      id: Math.random() * 100000000000000000 + '',
      role: UserRole.User,
    };
    logger.debug(`Created user with id ${newUser.id}`, newUser);
    await add('RegistrationMail', newUser);
    return newUser;
  }
}

import createError from "http-errors";
import bcrypt from "bcrypt";
import User from "../../db/entity/User.entity";

class UserService {
  public async createNewUser(email: string, password: string) {
    return await User.create({ email, password }).save();
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new createError.BadRequest(
        "Unable to find a account with the given email"
      );
    }
    return user;
  }

  public async findAndValidateUser(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.findUserByEmail(email);
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new createError.Unauthorized("Invalid email/password");
    }
    return user;
  }
}

export const userService = new UserService();

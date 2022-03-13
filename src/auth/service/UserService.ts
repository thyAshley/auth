import User from "../../db/entity/User.entity";

class UserService {
  public async createNewUser(email: string, password: string) {
    return await User.create({ email, password }).save();
  }

  public async findUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }
}

export const userService = new UserService();

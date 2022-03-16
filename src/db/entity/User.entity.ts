import {
  BaseEntity,
  BeforeInsert,
  BeforeRecover,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { ToLowerCaseTransformer } from "../transformer";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: "varchar",
    transformer: ToLowerCaseTransformer,
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  public password: string;

  @BeforeInsert()
  private encryptPassword() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}

export default User;

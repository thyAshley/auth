import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ToLowerCaseTransformer } from "../transformer";

@Entity()
class User {
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
}

export default User;

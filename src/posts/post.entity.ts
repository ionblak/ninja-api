import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  //Todo check with Rost why it doesn`t work
  @Transform((value) => {
    if (value !== null) {
      return value;
    }
  })
  public category?: string;
}

import {
    BaseEntity,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
  } from "typeorm"
  
  @Entity()
  export class EmailSubscription extends BaseEntity {
    @PrimaryColumn()
    email: string
  
    @CreateDateColumn()
    created_at: Date
  }
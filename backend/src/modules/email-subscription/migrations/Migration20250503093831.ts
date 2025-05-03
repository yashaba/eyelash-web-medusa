import { Migration } from '@mikro-orm/migrations';

export class Migration20250503093831 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "email-subscription" ("id" text not null, "email" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "email-subscription_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_email-subscription_deleted_at" ON "email-subscription" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "email-subscription" cascade;`);
  }

}

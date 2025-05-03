import { Migration } from '@mikro-orm/migrations';

export class Migration20250503144538 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "email-subscription" drop constraint if exists "email-subscription_email_unique";`);
    this.addSql(`alter table if exists "email-subscription" add column if not exists "ip" text not null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_email-subscription_email_unique" ON "email-subscription" (email) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_email-subscription_email_unique";`);
    this.addSql(`alter table if exists "email-subscription" drop column if exists "ip";`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250503142832 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "email-subscription" add column if not exists "lang" text not null, add column if not exists "failed" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "email-subscription" drop column if exists "lang", drop column if exists "failed";`);
  }

}

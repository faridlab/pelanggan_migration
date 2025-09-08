import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const TYPES = ['home', 'work', 'school', 'main', 'email', 'business', 'personal', 'other'];
  return knex.schema.createTable('contact_emails', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.enum('type', TYPES).notNullable().defaultTo('email');
    table.string('type_other', 255).nullable();
    table.string('email', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('type');
    table.index('email');

    // Create foreign key constraint
    table.foreign('contact_id', 'contact_emails_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contact_emails');
}

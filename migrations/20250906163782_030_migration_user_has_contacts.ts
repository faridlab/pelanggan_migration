import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_has_contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.uuid('user_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('user_id');

    // Create foreign key constraints
    table.foreign('contact_id', 'user_has_contacts_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.foreign('user_id', 'user_has_contacts_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_has_contacts');
}

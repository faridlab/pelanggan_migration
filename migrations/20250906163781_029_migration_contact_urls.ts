import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const TYPES = ['home', 'work', 'school', 'main', 'homepage', 'other'];
  return knex.schema.createTable('contact_urls', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.enum('type', TYPES).notNullable().defaultTo('homepage');
    table.string('type_other', 255).nullable();
    table.string('url', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('type');

    // Create foreign key constraint
    table.foreign('contact_id', 'contact_urls_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contact_urls');
}

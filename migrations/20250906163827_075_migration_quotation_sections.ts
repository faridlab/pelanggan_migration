import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('quotation_sections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('quotation_id').notNullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.json('data').nullable();
    table.specificType('order', 'SMALLINT').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('quotation_id');
    table.index('order');

    // Create foreign key constraints
    table.foreign('quotation_id', 'quotation_sections_quotation_id_foreign')
      .references('id')
      .inTable('quotations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('quotation_sections');
}

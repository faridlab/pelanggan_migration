import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('quotation_section_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('quotation_id').notNullable();
    table.uuid('item_id').notNullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('quotation_id');
    table.index('item_id');

    // Create foreign key constraints
    table.foreign('item_id', 'quotation_section_items_item_id_foreign')
      .references('id')
      .inTable('quotation_items')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('quotation_id', 'quotation_section_items_quotation_id_foreign')
      .references('id')
      .inTable('quotations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('quotation_section_items');
}

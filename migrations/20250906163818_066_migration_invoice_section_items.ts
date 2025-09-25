import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoice_section_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('invoice_id').notNullable();
    table.uuid('item_id').notNullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('invoice_id');
    table.index('item_id');

    // Create foreign key constraints
    table.foreign('invoice_id', 'invoice_section_items_invoice_id_foreign')
      .references('id')
      .inTable('invoices')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('item_id', 'invoice_section_items_item_id_foreign')
      .references('id')
      .inTable('invoice_items')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('invoice_section_items');
}

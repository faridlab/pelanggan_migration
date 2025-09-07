import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_stocks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.uuid('warehouse_id').notNullable();
    table.string('status', 255).notNullable().defaultTo('intial');
    table.integer('total').notNullable().defaultTo(1);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.uuid('variant_id').nullable();

    // Create indexes
    table.index('product_id');
    table.index('warehouse_id');
    table.index('status');
    table.index('variant_id');

    // Create foreign key constraints
    table.foreign('product_id', 'product_stocks_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('warehouse_id', 'product_stocks_warehouse_id_foreign')
      .references('id')
      .inTable('warehouses')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('variant_id', 'product_stocks_variant_id_foreign')
      .references('id')
      .inTable('product_variant_units')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_stocks');
}

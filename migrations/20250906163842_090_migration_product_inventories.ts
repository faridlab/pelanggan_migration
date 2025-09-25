import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_inventories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.uuid('warehouse_id').notNullable();
    table.uuid('variant_id').nullable(); // From product_stocks

    // Stock quantities
    table.integer('stock_quantity').notNullable().defaultTo(0);
    table.integer('reserved_quantity').notNullable().defaultTo(0);
    table.integer('available_quantity').notNullable().defaultTo(0);

    // Inventory management
    table.integer('reorder_point').nullable();
    table.integer('max_stock').nullable();
    table.string('location_in_warehouse').nullable();
    table.timestamp('last_restocked_at').nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    table.index(['product_id', 'warehouse_id']);
    table.index(['product_id', 'warehouse_id', 'variant_id']);
    table.index('last_restocked_at');

    // Foreign keys
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.foreign('variant_id').references('id').inTable('product_variant_units').onDelete('CASCADE');

    // Constraints
    table.check('stock_quantity >= 0', [], 'stock_quantity_positive');
    table.check('reserved_quantity >= 0', [], 'reserved_quantity_positive');
    table.check('available_quantity >= 0', [], 'available_quantity_positive');
    table.check('reserved_quantity <= stock_quantity', [], 'reserved_not_exceed_stock');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_inventories');
}
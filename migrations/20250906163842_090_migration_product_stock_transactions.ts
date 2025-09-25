import type { Knex } from "knex";

// Migration for product_stock_transactions (simplified, no variants)
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_stock_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.uuid('warehouse_id').notNullable();

    // Transaction details
    table.enum('type', ['in', 'out', 'adjustment']).notNullable();
    table.enum('reason', [
      'purchase',        // Stock in from supplier
      'sale',           // Stock out from customer order
      'return',         // Stock in from customer return
      'adjustment',     // Manual stock correction
      'damage',         // Stock out due to damage
      'expired',        // Stock out due to expiration
      'transfer_in',    // Stock in from another warehouse
      'transfer_out'    // Stock out to another warehouse
    ]).notNullable();

    // Quantities
    table.integer('quantity').notNullable(); // +100 for stock in, -5 for stock out

    // Reference information
    table.uuid('reference_id').nullable(); // order_id, purchase_order_id, etc.
    table.string('reference_type').nullable(); // 'order', 'purchase', 'adjustment'
    table.text('notes').nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.uuid('created_by').nullable();

    // Indexes for performance
    table.index(['product_id', 'warehouse_id']);
    table.index(['type', 'reason']);
    table.index('created_at');
    table.index(['reference_id', 'reference_type']);

    // Foreign keys
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_product_stock_transactions');
}
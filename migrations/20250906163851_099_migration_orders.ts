import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('trx_id', 255).nullable();
    table.uuid('user_id').notNullable();
    table.uuid('product_id').notNullable();
    table.uuid('warehouse_id').notNullable();
    table.uuid('promo_id').nullable();
    table.string('status', 255).notNullable().defaultTo('settlement');
    table.string('currency', 255).notNullable().defaultTo('IDR');
    table.float('price').notNullable();
    table.integer('quantity').notNullable();
    table.float('tax').notNullable().defaultTo(0);
    table.float('discount').notNullable().defaultTo(0);
    table.float('total').notNullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.uuid('transaction_id').nullable();

    // Create indexes
    table.index('trx_id');
    table.index('user_id');
    table.index('product_id');
    table.index('warehouse_id');
    table.index('promo_id');
    table.index('status');
    table.index('transaction_id');

    // Create foreign key constraints
    table.foreign('user_id', 'orders_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('product_id', 'orders_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('warehouse_id', 'orders_warehouse_id_foreign')
      .references('id')
      .inTable('warehouses')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('promo_id', 'orders_promo_id_foreign')
      .references('id')
      .inTable('promotions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('transaction_id', 'orders_transaction_id_foreign')
      .references('id')
      .inTable('transactions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}

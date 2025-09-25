import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tracking_orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('transaction_id').notNullable();
    table.uuid('status_id').notNullable();
    table.integer('order').notNullable();
    table.string('note', 255).nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('transaction_id');
    table.index('status_id');
    table.index('order');

    // Create foreign key constraints
    table.foreign('transaction_id', 'tracking_orders_transaction_id_foreign')
      .references('id')
      .inTable('transactions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('status_id', 'tracking_orders_status_id_foreign')
      .references('id')
      .inTable('tracking_statuses')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tracking_orders');
}

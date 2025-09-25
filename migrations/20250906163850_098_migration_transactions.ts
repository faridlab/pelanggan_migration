import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('trx_id', 255).nullable();
    table.uuid('user_id').notNullable();
    table.uuid('promo_id').nullable();
    table.timestamp('purchase_date', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.string('status', 255).notNullable().defaultTo('settlement');
    table.string('currency', 255).notNullable().defaultTo('IDR');
    table.float('price').notNullable();
    table.integer('quantity').notNullable();
    table.json('address').notNullable();
    table.json('expedition').nullable();
    table.float('tax').notNullable().defaultTo(0);
    table.float('discount').notNullable().defaultTo(0);
    table.float('admin_fee').notNullable().defaultTo(0);
    table.float('insurance_fee').notNullable().defaultTo(0);
    table.float('expedition_fee').notNullable().defaultTo(0);
    table.float('total').notNullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('trx_id');
    table.index('user_id');
    table.index('promo_id');
    table.index('status');
    table.index('purchase_date');

    // Create foreign key constraints
    table.foreign('user_id', 'transactions_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('promo_id', 'transactions_promo_id_foreign')
      .references('id')
      .inTable('promotions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}

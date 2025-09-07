import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('journals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.timestamp('transaction_date', { useTz: false }).notNullable();
    table.string('reference_number').nullable();
    table.enum('position', ['debit', 'credit']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('description').nullable();
    table.string('payment_method').nullable();
    table.uuid('account').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('transaction_date');
    table.index('reference_number');
    table.index('account');

    // Create foreign key constraint
    table.foreign('account', 'journals_account_foreign')
      .references('id')
      .inTable('accounts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('journals');
}

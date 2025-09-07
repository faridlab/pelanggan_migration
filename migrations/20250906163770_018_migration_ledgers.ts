import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ledgers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account').notNullable();
    table.timestamp('period_start', { useTz: false }).notNullable();
    table.timestamp('period_end', { useTz: false }).notNullable();
    table.decimal('beginning_balance', 15, 2).notNullable().defaultTo(0);
    table.decimal('ending_balance', 15, 2).notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create unique constraint
    table.unique(['account', 'period_start', 'period_end']);

    // Create indexes
    table.index('account');
    table.index(['period_start', 'period_end']);

    // Create foreign key constraint
    table.foreign('account', 'ledgers_account_foreign')
      .references('id')
      .inTable('accounts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ledgers');
}

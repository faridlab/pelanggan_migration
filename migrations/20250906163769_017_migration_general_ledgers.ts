import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('general_ledgers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account').notNullable();
    table.timestamp('posting_date', { useTz: false }).notNullable();
    table.text('description').nullable();
    table.decimal('debit', 15, 2).notNullable().defaultTo(0);
    table.decimal('credit', 15, 2).notNullable().defaultTo(0);
    table.uuid('journal').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('account');
    table.index('posting_date');
    table.index('journal');

    // Create foreign key constraints
    table.foreign('account', 'general_ledgers_account_foreign')
      .references('id')
      .inTable('accounts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('journal', 'general_ledgers_journal_foreign')
      .references('id')
      .inTable('journals')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('general_ledgers');
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.smallint('group').notNullable();
    table.string('code', 10).notNullable().unique();
    table.enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']).notNullable();
    table.enum('position', ['debit', 'credit']).notNullable();
    table.string('sub_type').nullable();
    table.string('parent_code', 10).nullable();
    table.enum('level', ['H', 'D']).notNullable().defaultTo('H');
    table.string('name').notNullable();
    table.string('currency', 3).nullable();
    table.boolean('is_bank_cash').notNullable().defaultTo(false);
    table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.uuid('parent').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('code');
    table.index('type');

    // Create self-referencing foreign key
    table.foreign('parent', 'accounts_parent_foreign')
      .references('id')
      .inTable('accounts')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts');
}
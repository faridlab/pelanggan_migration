import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['active', 'inactive', 'draft'];
  return knex.schema.createTable('contracts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('subject', 255).notNullable();
    table.text('description').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.uuid('type_id').notNullable();
    table.uuid('client_id').notNullable();
    table.decimal('value_contract', 15, 2).notNullable();
    table.string('base_currency', 3).notNullable().defaultTo('IDR');
    table.string('exchange_currency', 3).notNullable().defaultTo('IDR');
    table.decimal('exchange_value', 15, 2).notNullable().defaultTo(0);
    table.text('address_alternative').nullable();
    table.text('note').nullable();
    table.enum('status', statuses).notNullable().defaultTo('active');
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('type_id');
    table.index('client_id');
    table.index('status');
    table.index('start_date');
    table.index('end_date');

    // Create foreign key constraints
    table.foreign('type_id', 'contracts_type_id_foreign')
      .references('id')
      .inTable('contract_types')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('client_id', 'contracts_client_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contracts');
}

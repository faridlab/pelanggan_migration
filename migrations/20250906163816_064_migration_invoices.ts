import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['active', 'inactive', 'draft'];
  return knex.schema.createTable('invoices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').notNullable();
    table.string('base_currency', 3).notNullable().defaultTo('IDR');
    table.string('exchange_currency', 3).notNullable().defaultTo('IDR');
    table.decimal('exchange_value', 15, 2).notNullable().defaultTo(0);
    table.string('code_number', 255).notNullable();
    table.uuid('contact_id').notNullable();
    table.date('invoice_date').notNullable();
    table.date('due_date').notNullable();
    table.text('description').notNullable();
    table.json('data').nullable();
    table.enum('status', statuses).notNullable().defaultTo('draft');
    table.boolean('is_template').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('project_id');
    table.index('contact_id');
    table.index('status');
    table.index('invoice_date');
    table.index('due_date');
    table.index('code_number');
    table.index('is_template');

    // Create foreign key constraints
    table.foreign('project_id', 'invoices_project_id_foreign')
      .references('id')
      .inTable('projects')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('contact_id', 'invoices_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('invoices');
}

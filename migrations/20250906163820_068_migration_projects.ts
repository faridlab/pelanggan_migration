import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['draft', 'in-progress', 'not-started', 'on-hold', 'canceled', 'finished'];
  return knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('code_number', 6).notNullable();
    table.string('name', 255).notNullable();
    table.text('description').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.uuid('category_id').notNullable();
    table.uuid('organization_id').notNullable();
    table.uuid('client_id').notNullable();
    table.decimal('value_project', 15, 2).notNullable();
    table.string('base_currency', 3).notNullable().defaultTo('USD');
    table.string('exchange_currency', 3).notNullable().defaultTo('USD');
    table.decimal('exchange_value', 15, 2).notNullable().defaultTo(0);
    table.decimal('hours_estimate', 15, 2).notNullable().defaultTo(0);
    table.text('note').nullable();
    table.enum('status', statuses).notNullable().defaultTo('draft');
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('category_id');
    table.index('organization_id');
    table.index('client_id');
    table.index('status');
    table.index('start_date');
    table.index('end_date');
    table.index('code_number');

    // Create foreign key constraints
    table.foreign('organization_id', 'projects_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('client_id', 'projects_client_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('projects');
}

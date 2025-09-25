import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const BRANCH_TYPES = [
    'Headquarters',
    'Regional Office',
    'Local Branch',
    'Sales Office',
    'Service Center',
    'Manufacturing Plant',
    'R&D Center',
    'Distribution Center',
    'Subsidiary',
    'Representative Office',
    'Other'
  ];

  return knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('url', 255).nullable();
    table.string('organization_size', 255).notNullable();
    table.string('organization_type', 255).notNullable();
    table.integer('year_founded').nullable();
    table.enum('branch_type', BRANCH_TYPES).notNullable().defaultTo('Headquarters');
    table.string('branch_other').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('name');
    table.index('organization_type');

  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organizations');
}

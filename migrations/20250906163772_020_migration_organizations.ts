import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('url', 255).nullable();
    table.uuid('industry_id').notNullable();
    table.string('organization_size', 255).notNullable();
    table.string('organization_type', 255).notNullable();
    table.integer('year_founded').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
    table.string('branch_type', 255).notNullable().defaultTo('Headquarters');

    // Create indexes
    table.index('industry_id');
    table.index('name');
    table.index('organization_type');

    // Create foreign key constraint
    table.foreign('industry_id', 'organizations_industry_id_foreign')
      .references('id')
      .inTable('organization_industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organizations');
}

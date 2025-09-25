import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const STATUS = ['active', 'inactive'];
  return knex.schema.createTable('warehouses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('short_desc', 500).nullable();
    table.text('desc').nullable();
    table.enum('status', STATUS).notNullable().defaultTo('active');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('name');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('warehouses');
}

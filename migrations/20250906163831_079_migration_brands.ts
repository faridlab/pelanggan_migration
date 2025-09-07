import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('brands', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('slug', 255).nullable();
    table.string('short_desc', 500).nullable();
    table.text('desc').nullable();
    table.string('status', 255).notNullable().defaultTo('active');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.integer('order').nullable();

    // Create indexes
    table.index('name');
    table.index('slug');
    table.index('status');
    table.index('order');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('brands');
}

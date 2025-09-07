import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('foreign_table', 255).nullable();
    table.string('foreign_id', 255).nullable();
    table.string('type', 255).notNullable().defaultTo('like');
    table.string('reaction', 255).nullable();
    table.uuid('created_by').notNullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('foreign_table');
    table.index('foreign_id');
    table.index('type');
    table.index('created_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('reactions');
}

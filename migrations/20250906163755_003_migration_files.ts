import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('directory', 255).defaultTo('files');
    table.string('fullpath', 1024).notNullable();
    table.string('path', 1024).notNullable();
    table.string('filename', 1024).notNullable();
    table.string('title', 1024);
    table.string('description', 1024);
    table.integer('size').notNullable();
    table.string('ext', 10).notNullable();
    table.string('type', 255).notNullable().defaultTo('other');
    table.string('foreign_table', 255);
    table.string('foreign_id', 255);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
    table.integer('order').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('files');
}

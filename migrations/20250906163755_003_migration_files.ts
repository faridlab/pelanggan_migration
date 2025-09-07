import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('directory', 255).defaultTo('files');
    table.string('fullpath', 1024).notNullable();
    table.string('path', 1024).notNullable();
    table.string('filename', 1024).notNullable();
    table.string('title', 1024).nullable();
    table.string('description', 1024).nullable();
    table.integer('size').nullable();
    table.string('ext', 10).nullable();
    table.enum('type', ['image', 'video', 'audio', 'document', 'other']).notNullable().defaultTo('image');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('files');
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sysparams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('group', 255).notNullable();
    table.string('key', 255).notNullable();
    table.string('value', 255).notNullable();
    table.json('data');
    table.smallint('order');
    table.string('status', 255).notNullable().defaultTo('active');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('sysparams');
}

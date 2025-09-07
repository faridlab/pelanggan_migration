import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('type', 255).notNullable().defaultTo('product');
    table.string('type_other', 255).nullable();
    table.string('name', 255).notNullable();
    table.string('slug', 255).nullable();
    table.smallint('order').notNullable().defaultTo(0);
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.uuid('parent_id').nullable();
    table.boolean('choice').notNullable().defaultTo(false);
    table.smallint('choice_order').nullable();

    // Create indexes
    table.index('type');
    table.index('name');
    table.index('slug');
    table.index('parent_id');
    table.index('choice');
    table.index('order');

    // Create foreign key constraints
    table.foreign('parent_id', 'categories_parent_id_foreign')
      .references('id')
      .inTable('categories')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('categories');
}

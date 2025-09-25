import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_preorders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable().unique(); // Satu produk hanya punya satu setting preorder
    table.boolean('is_available').notNullable().defaultTo(false);
    table.integer('duration').nullable();
    table.string('time_unit', 50).notNullable().defaultTo('day'); // 'day', 'week'

    table.index('product_id');
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_preorders');
}

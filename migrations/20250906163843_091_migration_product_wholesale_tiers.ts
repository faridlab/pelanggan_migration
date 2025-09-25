import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_wholesale_tiers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.integer('min_quantity').notNullable();
    table.integer('max_quantity').nullable();
    table.float('price_per_unit').notNullable();

    table.index('product_id');
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_wholesale_tiers');
}

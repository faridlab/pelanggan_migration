import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_showcases', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.uuid('showcase_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('product_id');
    table.index('showcase_id');

    // Create foreign key constraints
    table.foreign('product_id', 'product_showcases_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('showcase_id', 'product_showcases_showcase_id_foreign')
      .references('id')
      .inTable('showcases')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_showcases');
}

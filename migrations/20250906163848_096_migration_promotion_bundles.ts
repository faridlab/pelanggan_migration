import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('promotion_bundles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('promo_id').nullable();
    table.uuid('product_id').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('promo_id');
    table.index('product_id');

    // Create foreign key constraints
    table.foreign('promo_id', 'promotion_bundle_promo_id_foreign')
      .references('id')
      .inTable('promotions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('product_id', 'promotion_bundle_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('promotion_bundles');
}

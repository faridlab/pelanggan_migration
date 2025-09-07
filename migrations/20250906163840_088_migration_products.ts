import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('code', 16).nullable();
    table.string('name', 255).notNullable();
    table.string('slug', 255).nullable();
    table.text('description').notNullable();
    table.uuid('category_id').notNullable();
    table.string('currency', 255).notNullable().defaultTo('IDR');
    table.float('price').notNullable();
    table.string('status', 255).notNullable().defaultTo('inactive');
    table.string('condition', 255).notNullable().defaultTo('new');
    table.integer('min_order').notNullable().defaultTo(1);
    table.string('weight_unit', 255).notNullable().defaultTo('gram');
    table.float('weight').nullable();
    table.string('dimension_unit', 255).notNullable().defaultTo('cm');
    table.json('dimension').nullable();
    table.string('guarantee', 255).notNullable().defaultTo('distributor');
    table.boolean('is_must_insurance').notNullable().defaultTo(true);
    table.json('stock').nullable();
    table.string('sku', 255).nullable();
    table.string('sni', 255).nullable();
    table.json('wholesale').nullable();
    table.json('variant').nullable();
    table.uuid('brand_id').nullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.json('preorder').nullable().defaultTo('{"available":false,"duration":null,"time_unit":"day"}');
    table.float('price_discount').notNullable().defaultTo(0);
    table.float('price_discount_percentage').notNullable().defaultTo(0);
    table.string('video_url', 255).nullable();
    table.boolean('recommended').notNullable().defaultTo(false);

    // Create indexes
    table.index('code');
    table.index('name');
    table.index('slug');
    table.index('category_id');
    table.index('status');
    table.index('condition');
    table.index('brand_id');
    table.index('sku');
    table.index('recommended');

    // Create foreign key constraints
    table.foreign('brand_id', 'products_brand_id_foreign')
      .references('id')
      .inTable('brands')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('category_id', 'products_category_id_foreign')
      .references('id')
      .inTable('categories')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}

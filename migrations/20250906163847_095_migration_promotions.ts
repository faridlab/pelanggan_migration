import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('promotions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('code', 50).notNullable();
    table.string('type', 255).notNullable().defaultTo('standard');
    table.uuid('product_id').nullable();
    table.uuid('category_id').nullable();
    table.timestamp('start_at', { useTz: false }).nullable();
    table.timestamp('expired_at', { useTz: false }).nullable();
    table.integer('quota').nullable();
    table.string('discount_unit', 255).notNullable().defaultTo('price');
    table.integer('discount').notNullable();
    table.integer('discount_upto').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.string('status', 255).notNullable().defaultTo('inactive');
    table.boolean('is_flashsale').notNullable().defaultTo(false);
    table.uuid('showcase_id').nullable();
    table.string('category', 255).notNullable().defaultTo('all');

    // Create indexes
    table.index('name');
    table.index('code');
    table.index('type');
    table.index('product_id');
    table.index('category_id');
    table.index('start_at');
    table.index('expired_at');
    table.index('status');
    table.index('showcase_id');

    // Create foreign key constraints
    table.foreign('product_id', 'promotions_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('category_id', 'promotions_category_id_foreign')
      .references('id')
      .inTable('categories')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('showcase_id', 'promotions_showcase_id_foreign')
      .references('id')
      .inTable('showcases')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('promotions');
}

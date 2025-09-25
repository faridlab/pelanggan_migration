import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_variant_units', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('variant_id').notNullable();
    table.string('type', 255).notNullable().defaultTo('custom');
    table.string('name', 255).notNullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.string('status', 255).notNullable().defaultTo('active');
    table.string('label', 255).notNullable();
    table.string('label_english', 255).notNullable();
    table.string('hex', 10).nullable();
    table.string('icon', 255).nullable();
    table.float('price').notNullable();
    table.integer('stock').notNullable();
    table.string('sku', 255).nullable();
    table.float('weight').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('variant_id');
    table.index('type');
    table.index('name');
    table.index('is_primary');
    table.index('status');
    table.index('sku');

    // Create foreign key constraints
    table.foreign('variant_id', 'product_variant_units_variant_id_foreign')
      .references('id')
      .inTable('product_variants')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_variant_units');
}

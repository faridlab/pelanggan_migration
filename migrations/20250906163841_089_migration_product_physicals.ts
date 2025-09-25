import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const weight_units = ['gram', 'kg', 'mg', 'lb', 'oz'];
  const dimension_units = ['cm', 'm', 'mm', 'in', 'ft'];
  const volume_units = ['ml', 'l', 'gal', 'oz'];
  const conditions = [
    'new', 'like-new', 'used-excellent', 'used-good', 'used-fair',
    'used-poor', 'refurbished', 'open-box', 'demo', 'for-parts'
  ];

  return knex.schema.createTable('product_physicals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();

    // Weight
    table.float('weight').notNullable();
    table.enum('weight_unit', weight_units).notNullable().defaultTo('gram');

    // Dimensions
    table.float('length').nullable();
    table.float('width').nullable();
    table.float('height').nullable();
    table.float('diameter').nullable(); // For cylindrical items
    table.enum('dimension_unit', dimension_units).notNullable().defaultTo('cm');
    table.enum('shape', ['rectangular', 'cylindrical', 'spherical', 'irregular']).nullable();

    // Volume (for liquids)
    table.float('volume').nullable();
    table.enum('volume_unit', volume_units).nullable();

    // Physical properties
    table.enum('condition', conditions).notNullable().defaultTo('new');
    table.string('color', 100).nullable();
    table.string('material', 255).nullable();
    table.string('size', 50).nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    table.index('product_id');
    table.index('condition');
    table.index('color');
    table.index('material');

    // Foreign key
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');

    // Constraints
    table.check('weight > 0', [], 'weight_positive');
    table.check('length IS NULL OR length > 0', [], 'length_positive');
    table.check('width IS NULL OR width > 0', [], 'width_positive');
    table.check('height IS NULL OR height > 0', [], 'height_positive');
    table.check('volume IS NULL OR volume > 0', [], 'volume_positive');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_physicals');
}

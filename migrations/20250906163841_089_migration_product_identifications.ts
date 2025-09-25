import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_identifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();

    // Basic product identification
    table.integer('min_order').notNullable().defaultTo(1);

    // Internal identifiers
    table.string('sku', 255).nullable();
    table.string('model_number', 255).nullable();
    table.string('mpn', 255).nullable(); // Manufacturer Part Number

    // Indonesian standards
    table.string('sni', 255).nullable();
    table.boolean('is_sni_compliant').notNullable().defaultTo(false);
    table.date('sni_certification_date').nullable();
    table.date('sni_expiry_date').nullable();

    table.string('k3l', 255).nullable();

    // International standards
    table.string('ean', 13).nullable(); // European Article Number
    table.string('upc', 12).nullable(); // Universal Product Code
    table.string('isbn', 13).nullable(); // For books
    table.string('asin', 10).nullable(); // Amazon Standard Identification Number
    table.string('gtin', 14).nullable(); // Global Trade Item Number

    // Indonesian specific certifications
    table.string('halal_certificate', 255).nullable();
    table.boolean('is_halal_certified').notNullable().defaultTo(false);
    table.string('bpom_number', 255).nullable(); // BPOM registration
    table.string('customs_code', 20).nullable(); // HS Code

    // Product lifecycle
    table.string('serial_number', 255).nullable();
    table.string('batch_number', 255).nullable();
    table.string('lot_number', 255).nullable();
    table.date('manufacturing_date').nullable();
    table.date('expiry_date').nullable();

    // Origin information
    table.string('origin_country', 2).nullable(); // ISO country code
    table.string('origin_city', 255).nullable();

    // Additional certifications
    table.boolean('is_organic_certified').notNullable().defaultTo(false);
    table.boolean('is_eco_friendly').notNullable().defaultTo(false);

    // Packaging information
    table.integer('units_per_package').nullable();
    table.string('package_type', 100).nullable();
    table.string('unit_of_measure', 50).nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    table.index('product_id');
    table.index('sku');
    table.index('sni');
    table.index('ean');
    table.index('upc');
    table.index('isbn');
    table.index('asin');
    table.index('halal_certificate');
    table.index('bpom_number');

    // Foreign key constraint
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_identifications');
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const guarantees = [
    'distributor', // Garansi Distributor
    'brand', // Garansi Merek (Resmi)
    'store', // Garansi Toko
    'indonesia', // Indonesia
    'international', // International
    'noguarantee', // Tidak ada garansi
  ];

  return knex.schema.createTable('product_guarantees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.enum('guarantee', guarantees).notNullable().defaultTo('distributor');
    table.integer('duration_months').nullable(); // Guarantee duration in months
    table.enum('status', ['active', 'inactive', 'expired']).defaultTo('active');
    table.text('guarantee_terms').nullable(); // Terms and conditions

    table.boolean('is_must_insurance').notNullable().defaultTo(false);

    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    table.index('product_id');
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_guarantees');
}

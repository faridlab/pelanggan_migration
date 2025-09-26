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

  await knex.schema.createTable('product_guarantees', (table) => {
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

  // Create a function to update the updated_at column
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create a trigger to call the function on UPDATE
  await knex.raw(`
    CREATE TRIGGER update_product_updated_at
    BEFORE UPDATE ON product
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_product_updated_at ON product;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('product');
}

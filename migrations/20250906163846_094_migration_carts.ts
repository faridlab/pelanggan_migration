import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('carts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('product_id').notNullable();
    table.string('currency', 255).notNullable().defaultTo('IDR');
    table.float('price').notNullable();
    table.integer('quantity').notNullable();
    table.float('total').notNullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.string('status', 255).notNullable().defaultTo('active');

    // Create indexes
    table.index('user_id');
    table.index('product_id');
    table.index('status');

    // Create foreign key constraints
    table.foreign('user_id', 'carts_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('product_id', 'carts_product_id_foreign')
      .references('id')
      .inTable('products')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
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
    CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('carts');
}

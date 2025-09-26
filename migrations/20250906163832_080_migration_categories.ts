import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('parent_id').nullable();
    table.string('name').notNullable();
    table.string('type').nullable().defaultTo('product').comment('ex: product, service, post, page, other');
    table.string('slug').nullable();
    table.smallint('order').notNullable().defaultTo(0);
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('type');
    table.index('name');
    table.index('parent_id');

    // Create foreign key constraints
    table.foreign('parent_id', 'categories_parent_id_foreign')
      .references('id')
      .inTable('categories')
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
    CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('categories');
}

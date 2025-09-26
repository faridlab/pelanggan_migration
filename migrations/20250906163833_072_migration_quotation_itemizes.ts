import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('quotation_itemizes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('category_id').nullable();
    table.uuid('industry_id').nullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('category_id');
    table.index('industry_id');

    // Create foreign key constraints
    table.foreign('industry_id', 'quotation_itemizes_industry_id_foreign')
      .references('id')
      .inTable('industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('category_id', 'quotation_itemizes_category_id_foreign')
      .references('id')
      .inTable('industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
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
    CREATE TRIGGER update_quotation_updated_at
    BEFORE UPDATE ON quotation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_quotation_updated_at ON quotation;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('quotation');
}

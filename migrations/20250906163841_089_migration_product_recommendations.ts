import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const recommendationTypes = ['featured', 'trending', 'seasonal', 'cross_sell', 'upsell', 'manual'];
  const targetAudiences = ['all', 'new_customers', 'vip_members', 'returning_customers'];

  await knex.schema.createTable('product_recommendations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();

    // Enhanced recommendation fields
    table.enum('type', recommendationTypes).notNullable().defaultTo('manual');
    table.enum('target_audience', targetAudiences).notNullable().defaultTo('all');
    table.boolean('recommended').notNullable().defaultTo(true);
    table.integer('priority').notNullable().defaultTo(1); // For algorithm weighting

    // Time-based recommendations
    table.timestamp('starts_at', { useTz: false }).nullable();
    table.timestamp('expires_at', { useTz: false }).nullable();

    // Additional metadata
    table.text('reason').nullable(); // Why this product is recommended
    table.json('criteria').nullable(); // Flexible criteria for algorithm-based recommendations

    // Standard audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Enhanced indexes
    table.index('product_id');
    table.index(['type', 'target_audience']);
    table.index(['starts_at', 'expires_at']);
    table.index(['recommended']);

    // Unique constraint to prevent duplicates
    table.unique(['product_id', 'type', 'target_audience'], {
      predicate: knex.whereRaw('deleted_at IS NULL')
    });

    // Foreign key constraint
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');

    // Constraints
    table.check('priority >= 1', [], 'priority_positive');
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
    CREATE TRIGGER update_product_recommendations_updated_at
    BEFORE UPDATE ON product_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_product_recommendations_updated_at ON product_recommendations;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('product_recommendations');
}

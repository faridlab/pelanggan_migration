import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const discountTypes = ['percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping'];
  const discountStatuses = ['active', 'inactive', 'expired', 'upcoming'];

  await knex.schema.createTable('product_discounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();

    // Discount identification
    table.string('name').notNullable().defaultTo('Discount'); // e.g., "Black Friday Sale", "Member Discount"
    table.text('description').nullable();

    // Discount type and value
    table.enum('type', discountTypes).notNullable();
    table.float('value').notNullable(); // Single field for discount amount
    table.enum('status', discountStatuses).notNullable().defaultTo('active');

    // Validity period
    table.timestamp('starts_at', { useTz: false }).nullable();
    table.timestamp('expires_at', { useTz: false }).nullable();

    // Conditions and limits
    table.integer('min_quantity').nullable(); // Minimum quantity to apply discount
    table.integer('max_uses').nullable(); // Maximum number of uses
    table.integer('used_count').notNullable().defaultTo(0);
    table.float('min_order_amount').nullable(); // Minimum order amount

    // Priority for multiple discounts
    table.integer('priority').notNullable().defaultTo(1); // Lower number = higher priority

    // Metadata
    table.json('conditions').nullable(); // Flexible conditions (e.g., user groups, payment methods)
    table.boolean('is_cumulative').notNullable().defaultTo(false); // Can be combined with other discounts

    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes for performance
    table.index('product_id');
    table.index('status');
    table.index('starts_at');
    table.index('expires_at');
    table.index(['product_id', 'status', 'starts_at', 'expires_at']); // Composite for active discounts

    // Foreign key constraint
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');

    // Constraints
    table.check('value >= 0', [], 'discount_value_positive');
    table.check('priority >= 1', [], 'priority_positive');
    table.check('used_count >= 0', [], 'used_count_positive');
    table.check('min_quantity IS NULL OR min_quantity > 0', [], 'min_quantity_positive');
    table.check('max_uses IS NULL OR max_uses > 0', [], 'max_uses_positive');
    table.check('min_order_amount IS NULL OR min_order_amount >= 0', [], 'min_order_amount_positive');

    // Ensure only one active discount per product (optional - depends on business rules)
    // table.unique(['product_id', 'status'], {
    //   predicate: knex.whereRaw('status = ? AND deleted_at IS NULL', ['active'])
    // });
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
    CREATE TRIGGER update_product_discounts_updated_at
    BEFORE UPDATE ON product_discounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_product_discounts_updated_at ON product_discounts;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('product_discounts');
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const BRANCH_TYPES = [
    'Headquarters',
    'Regional Office',
    'Local Branch',
    'Sales Office',
    'Service Center',
    'Manufacturing Plant',
    'R&D Center',
    'Distribution Center',
    'Subsidiary',
    'Representative Office',
    'Other'
  ];

  await knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('url', 255).nullable();
    table.string('organization_size', 255).notNullable();
    table.string('organization_type', 255).notNullable();
    table.integer('year_founded').nullable();
    table.enum('branch_type', BRANCH_TYPES).notNullable().defaultTo('Headquarters');
    table.string('branch_other').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('name');
    table.index('organization_type');

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
    CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('organizations');
}

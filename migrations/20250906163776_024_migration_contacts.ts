import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('company', 255).nullable();
    table.date('bod').nullable();
    table.string('prefix', 255).nullable();
    table.string('phonetic_first_name', 255).nullable();
    table.string('pronunciation_first_name', 255).nullable();
    table.string('middle_name', 255).nullable();
    table.string('phonetic_middle_name', 255).nullable();
    table.string('phonetic_last_name', 255).nullable();
    table.string('pronunciation_last_name', 255).nullable();
    table.string('maiden_name', 255).nullable();
    table.string('suffix', 255).nullable();
    table.string('nickname', 255).nullable();
    table.string('job_title', 255).nullable();
    table.string('department', 255).nullable();
    table.string('phonetic_company_name', 255).nullable();
    table.text('note').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });
    table.uuid('group_id').nullable();

    // Create indexes
    table.index('first_name');
    table.index('last_name');
    table.index('company');
    table.index('group_id');
    table.index('is_primary');

    // Create foreign key constraint
    table.foreign('group_id', 'contacts_group_id_foreign')
      .references('id')
      .inTable('contact_groups')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contacts');
}

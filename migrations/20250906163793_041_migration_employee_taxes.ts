import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const ptkp_status = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];
  const tax_methods = ['gross', 'gross-up', 'netto'];
  const tax_salary = ['taxable', 'non-taxable'];
  const tax_statuses = [
      'EMP-PRM',
      'EMP-XPRM',
      'XEMP-CTN',
      'XEMP-XCTN',
      'XPT',
      'XPT-DN',
      'XPRT-CTN',
      'XPRT-XCTN',
      'COMM',
      'XPRT-CTN01',
      'FRL',
      'XEMP-XCTN01',
  ];

  // TAX STATUS:
  // ===========
  // EMP-PRM: Pegawai tetap
  // EMP-XPRM: Pegawai tidak tetap
  // XEMP-CTN: Bukan pegawai yang bersifat berkesinambungan
  // XEMP-XCTN: Bukan pegawai yang tidak bersifat berkesinambungan
  // XPT: Ekspatriat
  // XPT-DN: Ekspatriat dalam negeri
  // XPRT-CTN: Tenaga ahli yang bersifat berkesinambungan
  // XPRT-XCTN: Tenaga ahli yang tidak bersifat berkesinambungan
  // COMM: Dewan komisaris
  // XPRT-CTN01: Tenaga ahli yang bersifat berkesinambungan >1 PK
  // FRL: Tenaga kerja lepas
  // XEMP-XCTN01: Bukan pegawai yang bersifat berkesinambungan >1 PK

  return knex.schema.createTable('employee_taxes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('npwp_number', 255).notNullable();
    table.enum('ptkp_status', ptkp_status).notNullable().defaultTo('TK/0');
    table.enum('tax_method', tax_methods).notNullable().defaultTo('gross');
    table.enum('tax_salary', tax_salary).notNullable().defaultTo('taxable');
    table.date('taxable_date').notNullable();
    table.enum('tax_status', tax_statuses).notNullable().defaultTo('EMP-PRM');
    table.integer('beginning_netto').nullable();
    table.integer('pph21_paid').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('npwp_number');
    table.index('tax_status');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_taxes_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employee_taxes');
}

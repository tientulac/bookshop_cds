context Types {
  type ConfirmStatus : String @assert.range enum {
    NOT_YET_APPROVED;
    IN_PROGRESS;
    APPROVED;
  };

  @assert.format        : '^(0[1-9]|1[0-2])\.\d{4}$'
  @assert.format.message: 'Invalid format. Expected MM.YYYY (e.g., 12.2025)'
  type PayrollPeriod : String(7);
}

async function claimInsurance(patientId, treatmentCost) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [p] = await connection.query(
      `SELECT \`limit\` FROM patients WHERE id = ? FOR UPDATE`,
      [patientId]
    );

    if (p[0].limit >= treatmentCost) {
      const newLimit = p[0].limit - treatmentCost;
      await connection.query(
        `UPDATE patients SET \`limit\` = ? WHERE id = ?`,
        [newLimit, patientId]
      );
      await connection.commit();
      return true;
    }

    await connection.commit();
    return false;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
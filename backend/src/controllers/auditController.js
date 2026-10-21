import { getAuditLogs, getAuditLogById } from '../services/auditService.js';


export async function listAuditoria(req, res) {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function getAuditoriaDetail(req, res) {
  try {
    const log = await getAuditLogById(req.params.id);


    if (!log) {
      return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
    }


    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

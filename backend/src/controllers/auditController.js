import { getAuditLogs, getAuditLogById } from '../services/auditService.js';
import { sendError } from '../middlewares/errorMiddleware.js';


export async function listAuditoria(req, res) {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (error) {
    sendError(res, error);
  }
}


export async function getAuditoriaDetail(req, res) {
  try {
    const log = await getAuditLogById(req.params.id);


    if (!log) {
      return res.status(404).json({ error: 'No encontramos ese registro de auditoría.' });
    }


    res.json(log);
  } catch (error) {
    sendError(res, error);
  }
}

import { orderService as svc } from '../services/order.service.js';

class OrderController {
    
    async listView(req, res) {
    }
    
    // API JSON
    async listJSON(req, res) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const status = req.query.status;
            const data = await svc.list({ page, limit, status });
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const o = await svc.get(req.params.id);
            if (!o) {
                return res.status(404).json({ error: "Orden no encontrada" });
            }
            res.status(200).json({ order: o });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async create(req, res) {
        try {
            const o = await svc.create(req.body);
            res.status(201).json({ order: o });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const o = await svc.update(req.params.id, req.body);
            if (!o) {
                return res.status(404).json({ error: "Orden no encontrada" });
            }
            res.status(200).json({ order: o });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async remove(req, res) {
        try {
            const o = await svc.remove(req.params.id);
            if (!o) {
                return res.status(404).json({ error: "Orden no encontrada" });
            }
            res.status(204).json();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Semilla Rapida (opcional)
    async seed(req, res) {
        try{
            const count = await svc.dao.count();
            if(count > 0) return res.status(200) .json({ message: "Ya hay ordenes, no se planto la semilla"});
            const sample = [
                {
                    code: "A-1001", buyerName: "Juan Perez", buyerEmail: "juan@example.com",
                    items: [
                        { title: "Teclado", qty: 1, unitPrice: 15000},
                        { title: "Mouse", qty: 2, unitPrice: 8000},
                    ], status: "pending"
                },
                {
                    code: "A-1002", buyerName: "Ana Garcia", buyerEmail: "anita@mail.com",
                    items : [
                        { title: "Monitor 24 Pulgadas FullHD", qty: 1, unitPrice: 170000 },
                    ], status: "paid"
                }
            ];
            const created = await Promise. all(sample.map( s => svc.create(s) ));
            res.status(201).json({inserted: created.length})
        } catch (err) {
            res.status(500).json({ error: err.message });
    }

export const orderController = new OrderController():

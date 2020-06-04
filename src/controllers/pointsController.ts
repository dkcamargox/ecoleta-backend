import { Request, Response} from 'express'
import knex from '../database/connection'

class PointsController {

    /**
     * retorna todos os pontos de coleta com seus items de coleta
     * filtros: cidade, province, items => (Query params)
     * @param request requisição http
     * @param response requisiçção http
     */
    async index(request: Request, response: Response) {
        const { city, province, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('province', String(province))
            .distinct()
            .select('points.*');

          
        
        return response.json(points)
    }

    /**
     * retorna na resposta o ponto de coleta com o memso id passado pelo
     * parametro de query, ou seja o id
     * @param request requisição http
     * @param response resposta http
     */
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({
                "error": "Point not found"
            });
        }  

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({
            point,
            items
        });
    }

    /**
     * cria um novo ponto de coleta
     * @param request requisição http
     * @param response resposta http
     */
    async create (request: Request, response: Response) {
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            province,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            province,
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];
        
        const pointItems = items.map( (item_id: number) => {
            return {
                item_id,
                point_id,
            };
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({ 
            id: point_id,
            ...point
        });
    }

}

export default PointsController
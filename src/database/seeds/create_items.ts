import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Lámparas', image: 'lampadas.svg' },
        { title: 'Pilas y Baterías', image: 'baterias.svg' },
        { title: 'Papeles y Cartones', image: 'papeis-papelao.svg' },
        { title: 'Residuos electrónicos', image: 'eletronicos.svg' },
        { title: 'Residuo orgánico', image: 'organicos.svg' },
        { title: 'Aceite de cocina', image: 'oleo.svg' },
    ])
};

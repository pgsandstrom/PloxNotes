import crypto from 'crypto';
import { db } from '../util/db';

export const load = id =>
  db.query('SELECT data FROM note WHERE id = $1', [id]).then(cursor => {
    if (cursor.rows.length > 0) {
      return cursor.rows[0].data;
    } else {
      return [
        {
          id: crypto.randomBytes(3).toString('hex'),
          text: '',
          checked: false,
        },
      ];
    }
  });

export const save = (id, data) =>
  // return db.query(SQL`UPDATE note SET data='${JSON.stringify(data)}'::jsonb WHERE id = '${id}'`); // TODO use that SQL stuff.. why it does not work :(

  db.query('SELECT data FROM note WHERE id = $1', [id]).then(result => {
    if (result.rows.length > 0) {
      return db.query('UPDATE note SET data=$1::jsonb WHERE id = $2', [JSON.stringify(data), id]);
    } else {
      // console.log(`Creating note with id "${id}"`); // eslint-disable-line no-console
      return db.query('INSERT INTO note(id, data) VALUES($1, $2)', [id, JSON.stringify(data)]);
    }
  });

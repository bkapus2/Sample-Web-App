import Select from './select';
import Where from './where';

export default function(properties) {

  const select = Select(properties);
  const where = Where(properties);

  const context = {
    select(cb) {
      const query = select(cb);
      return {
        where: where(query)
      }
    }
  }
  return context;
}
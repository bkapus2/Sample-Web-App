import handlePostgresqlStatement from './handlePostgresqlStatement';

const dialectTypes = {
  pgsql: handlePostgresqlStatement,
  default({ dialect }) {
    throw new Error(`Unsupported dialect (${dialect}).`)
  }
}

export default function({ dialect }) {
  return function({ statement }) {
    return 
  }
}
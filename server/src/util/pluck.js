export default function pluck(key) {
  return function(obj){
    return obj[key]
  };
}
export default function(submitHandler) {
  return function submit({ query }) {
    return function() {
      return submitHandler(query);
    }
  }
}
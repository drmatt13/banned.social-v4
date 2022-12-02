export default function validateUsername(username: string) {
  return String(username).match(
    /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  );
}

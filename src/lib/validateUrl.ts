// checks if a url is valid, looks for http://, https://, ftp::// at the beginning of the string
// also looks for sub domains and top level domains
const urlRegex =
  /^(http|https|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/;
const ipv4Regex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export default function validateUrl(url: string): boolean {
  return urlRegex.test(url) || ipv4Regex.test(url);
}

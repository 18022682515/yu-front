export function examineUser(str, count=6) {
    let re = new RegExp('^(?=.*[A-z])(?=.*\\d)[A-z\\d]{'+count+',30}$');
    let bool = re.test(str);
    return bool;
}